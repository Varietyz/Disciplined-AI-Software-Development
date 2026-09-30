import type { WriteFinding, WriteScope } from "../../types/analyzer.types.ts";
import { lineOf, relPath } from "../selectors/program.selector.ts";
import type { Edit } from "../../types/codemod.types.ts";
import { basename } from "node:path";
import ts from "typescript";

const PRIMITIVE = "writeFileSync";
const WRITER = "writeVerbatim";
const WRITER_MODULE = "@govlab/canonical-write";
const PRIMITIVE_MODULES = new Set(["fs", "node:fs"]);
const TEXT_ENCODING = "utf8";
const ENCODING_JOINER = "-";
const PLAIN_ARITY = 2;
const ENCODED_ARITY = 3;
const WRITER_IMPORT = `import { ${WRITER} } from "${WRITER_MODULE}";\n`;
const LINE_FEED = "\n";
const CARRIAGE_RETURN = "\r";

const isTextEncoding = function isTextEncoding(name: string): boolean {
    return name.toLowerCase().split(ENCODING_JOINER).join("") === TEXT_ENCODING;
};

const moduleOf = function moduleOf(statement: ts.ImportDeclaration): string {
    return ts.isStringLiteral(statement.moduleSpecifier) ? statement.moduleSpecifier.text : "";
};

const namedImportsOf = function namedImportsOf(statement: ts.ImportDeclaration): ts.NamedImports | null {
    const bindings = statement.importClause?.namedBindings;
    return bindings !== undefined && ts.isNamedImports(bindings) ? bindings : null;
};

const importsFrom = function importsFrom(source: ts.SourceFile, modules: ReadonlySet<string>): ts.ImportDeclaration[] {
    return source.statements.filter(
        (statement): statement is ts.ImportDeclaration =>
            ts.isImportDeclaration(statement) && modules.has(moduleOf(statement)),
    );
};

const primitiveSpecifier = function primitiveSpecifier(
    statement: ts.ImportDeclaration,
): ts.ImportSpecifier | undefined {
    return namedImportsOf(statement)?.elements.find(
        (element) => element.name.text === PRIMITIVE && element.propertyName === undefined,
    );
};

const referencesOf = function referencesOf(
    checker: ts.TypeChecker,
    source: ts.SourceFile,
    specifier: ts.ImportSpecifier,
): ts.Identifier[] {
    const target = checker.getSymbolAtLocation(specifier.name);
    const out: ts.Identifier[] = [];
    const visit = function visit(node: ts.Node): void {
        if (ts.isImportDeclaration(node)) {
            return;
        }
        if (ts.isIdentifier(node) && node.text === PRIMITIVE && checker.getSymbolAtLocation(node) === target) {
            out.push(node);
        }
        ts.forEachChild(node, visit);
    };
    ts.forEachChild(source, visit);
    return out;
};

const callOf = function callOf(reference: ts.Identifier): ts.CallExpression | null {
    const { parent } = reference;
    return ts.isCallExpression(parent) && parent.expression === reference ? parent : null;
};

const arityReason = function arityReason(call: ts.CallExpression): string | null {
    const count = call.arguments.length;
    if (count === PLAIN_ARITY) {
        return null;
    }
    const encoding = call.arguments[PLAIN_ARITY];
    if (count === ENCODED_ARITY && encoding !== undefined && ts.isStringLiteral(encoding)) {
        return isTextEncoding(encoding.text)
            ? null
            : `the write passes the '${encoding.text}' encoding, which the owner's verbatim write does not take`;
    }
    return `the write passes ${String(count)} arguments, where the owner's verbatim write takes a target and its content`;
};

const replacementOf = function replacementOf(source: ts.SourceFile, call: ts.CallExpression): string {
    const [target, content] = call.arguments;
    return `${WRITER}(${target?.getText(source) ?? ""}, ${content?.getText(source) ?? ""})`;
};

const lineEndAfter = function lineEndAfter(text: string, at: number): number {
    if (text.charAt(at) === CARRIAGE_RETURN && text.charAt(at + 1) === LINE_FEED) {
        return at + 2;
    }
    return text.charAt(at) === LINE_FEED ? at + 1 : at;
};

const namedText = function namedText(names: readonly string[]): string {
    return `{ ${names.join(", ")} }`;
};

const writerImportEdits = function writerImportEdits(source: ts.SourceFile): Edit[] | null {
    const existing = importsFrom(source, new Set([WRITER_MODULE])).find((statement) => namedImportsOf(statement));
    const named = existing === undefined ? null : namedImportsOf(existing);
    if (named === null) {
        return null;
    }
    const names = named.elements.map((element) => element.getText(source));
    if (named.elements.some((element) => element.name.text === WRITER)) {
        return [];
    }
    return [{ end: named.getEnd(), replacement: namedText([...names, WRITER]), start: named.getStart(source) }];
};

const primitiveImportEdits = function primitiveImportEdits(
    source: ts.SourceFile,
    statement: ts.ImportDeclaration,
    dropPrimitive: boolean,
    writerLine: string,
): Edit[] {
    const start = statement.getStart(source);
    const named = namedImportsOf(statement);
    const rest = (named?.elements ?? [])
        .filter((element) => element.name.text !== PRIMITIVE)
        .map((element) => element.getText(source));
    const insert: Edit[] = writerLine.length > 0 ? [{ end: start, replacement: writerLine, start }] : [];
    if (!dropPrimitive || named === null) {
        return insert;
    }
    const soleBinding = rest.length === 0 && statement.importClause?.name === undefined;
    if (soleBinding) {
        const end = lineEndAfter(source.text, statement.getEnd());
        return [{ end, replacement: writerLine, start }];
    }
    return [...insert, { end: named.getEnd(), replacement: namedText(rest), start: named.getStart(source) }];
};

const importEditsOf = function importEditsOf(
    source: ts.SourceFile,
    statement: ts.ImportDeclaration,
    dropPrimitive: boolean,
): Edit[] {
    const extended = writerImportEdits(source);
    const writerLine = extended === null ? WRITER_IMPORT : "";
    return [...(extended ?? []), ...primitiveImportEdits(source, statement, dropPrimitive, writerLine)];
};

const fileReason = function fileReason(source: ts.SourceFile, scope: WriteScope): string | null {
    return scope.declaresWriter(source.fileName)
        ? null
        : `the file's package does not declare ${WRITER_MODULE}, so the owner's writer cannot be imported here`;
};

export const scanSourceFile = function scanSourceFile(
    checker: ts.TypeChecker,
    source: ts.SourceFile,
    scope: WriteScope,
): WriteFinding[] {
    if (scope.owners.has(basename(source.fileName))) {
        return [];
    }
    return importsFrom(source, PRIMITIVE_MODULES).flatMap((statement) => {
        const specifier = primitiveSpecifier(statement);
        if (specifier === undefined) {
            return [];
        }
        const references = referencesOf(checker, source, specifier);
        const blockedFile = fileReason(source, scope);
        const calls = references.map(callOf);
        const sites = calls.filter((call): call is ts.CallExpression => call !== null);
        const reasons = sites.map((call) => blockedFile ?? arityReason(call));
        const dropPrimitive = calls.every((call) => call !== null) && reasons.every((reason) => reason === null);
        const importEdits = reasons.some((reason) => reason === null)
            ? importEditsOf(source, statement, dropPrimitive)
            : [];
        return sites.map((call, index) => ({
            end: call.getEnd(),
            file: relPath(source.fileName),
            fileName: source.fileName,
            importEdits,
            line: lineOf(source, call),
            reason: reasons[index] ?? null,
            replacement: replacementOf(source, call),
            start: call.getStart(source),
        }));
    });
};
