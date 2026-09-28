import type { IdentifierFinding, RenameLocation } from "../../types/analyzer.types.ts";
import { inRepo, lineOf, relPath, toPosix } from "../selectors/program.selector.ts";
import ts from "typescript";

const UPPER_A = 65;
const UPPER_Z = 90;
const DIGIT_0 = 48;
const DIGIT_9 = 57;
const UNDERSCORE = 95;

const isUpperAlpha = function isUpperAlpha(code: number): boolean {
    return code >= UPPER_A && code <= UPPER_Z;
};

const isConstantCase = function isConstantCase(name: string): boolean {
    for (let i = 0; i < name.length; i += 1) {
        const code = name.codePointAt(i) ?? 0;
        const allowed = isUpperAlpha(code) || code === UNDERSCORE || (code >= DIGIT_0 && code <= DIGIT_9);
        if (!allowed) {
            return false;
        }
    }
    return true;
};

const isPascalCase = function isPascalCase(name: string): boolean {
    if (name.length === 0 || !isUpperAlpha(name.codePointAt(0) ?? 0)) {
        return false;
    }
    return !isConstantCase(name);
};

const camelised = function camelised(name: string): string {
    return name.charAt(0).toLowerCase() + name.slice(1);
};

const isGenerated = function isGenerated(fileName: string): boolean {
    return toPosix(fileName).includes(".generated.");
};

const isConstDeclaration = function isConstDeclaration(node: ts.VariableDeclaration): boolean {
    const list = node.parent;
    if (!ts.isVariableDeclarationList(list)) {
        return false;
    }
    return (list.flags & ts.NodeFlags.Const) !== 0;
};

const declarationsOf = function declarationsOf(sourceFile: ts.SourceFile): ts.VariableDeclaration[] {
    const out: ts.VariableDeclaration[] = [];
    const visit = function visit(node: ts.Node): void {
        if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && isConstDeclaration(node)) {
            out.push(node);
        }
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);
    return out;
};

const unaliased = function unaliased(checker: ts.TypeChecker, symbol: ts.Symbol | undefined): ts.Symbol | undefined {
    if (!symbol) {
        return undefined;
    }
    return (symbol.flags & ts.SymbolFlags.Alias) === 0 ? symbol : checker.getAliasedSymbol(symbol);
};

const targetSymbol = function targetSymbol(checker: ts.TypeChecker, node: ts.Identifier): ts.Symbol | undefined {
    const { parent } = node;
    if (ts.isShorthandPropertyAssignment(parent)) {
        return unaliased(checker, checker.getShorthandAssignmentValueSymbol(parent));
    }
    return unaliased(checker, checker.getSymbolAtLocation(node));
};

const shorthandBlocked = function shorthandBlocked(node: ts.Identifier): boolean {
    const { parent } = node;
    return ts.isShorthandPropertyAssignment(parent) || ts.isBindingElement(parent);
};

const identifiersIn = function identifiersIn(sourceFile: ts.SourceFile): ts.Identifier[] {
    const out: ts.Identifier[] = [];
    const visit = function visit(node: ts.Node): void {
        if (ts.isIdentifier(node)) {
            out.push(node);
        }
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);
    return out;
};

const collectReferences = function collectReferences(
    program: ts.Program,
    files: readonly ts.SourceFile[],
    declared: ts.Symbol,
): { blocked: boolean; locations: RenameLocation[] } {
    const checker = program.getTypeChecker();
    const referencing = files.flatMap((sourceFile) =>
        identifiersIn(sourceFile)
            .filter((node) => targetSymbol(checker, node) === declared)
            .map((node) => ({ node, sourceFile })),
    );
    const locations = referencing
        .filter((hit) => !shorthandBlocked(hit.node))
        .map((hit) => ({
            end: hit.node.getEnd(),
            fileName: hit.sourceFile.fileName,
            start: hit.node.getStart(hit.sourceFile),
        }));
    return { blocked: referencing.some((hit) => shorthandBlocked(hit.node)), locations };
};

const nameTakenInFile = function nameTakenInFile(sourceFile: ts.SourceFile, name: string): boolean {
    const locals: unknown = Reflect.get(sourceFile, "locals");
    return locals instanceof Map && locals.has(name);
};

const blockedReason = function blockedReason(blocked: boolean, collides: boolean, to: string): string | null {
    if (collides) {
        return `the file already declares '${to}', so renaming would shadow or collide with an existing binding`;
    }
    if (blocked) {
        return "the name is used in a shorthand property or binding pattern, where renaming would silently change the property key";
    }
    return null;
};

const findingsIn = function findingsIn(
    program: ts.Program,
    files: readonly ts.SourceFile[],
    sourceFile: ts.SourceFile,
): IdentifierFinding[] {
    const checker = program.getTypeChecker();
    const out: IdentifierFinding[] = [];
    const renameable = declarationsOf(sourceFile)
        .map((declaration) => declaration.name)
        .filter((name) => ts.isIdentifier(name) && isPascalCase(name.text));
    for (const name of renameable) {
        const declared = ts.isIdentifier(name) ? targetSymbol(checker, name) : undefined;
        if (declared === undefined || !ts.isIdentifier(name)) {
            continue;
        }
        const to = camelised(name.text);
        const { blocked, locations } = collectReferences(program, files, declared);
        out.push({
            file: relPath(sourceFile.fileName),
            fileName: sourceFile.fileName,
            from: name.text,
            line: lineOf(sourceFile, name),
            locations: locations.filter((location) => inRepo(location.fileName) && !isGenerated(location.fileName)),
            reason: blockedReason(blocked, nameTakenInFile(sourceFile, to), to),
            to,
        });
    }
    return out;
};

export const scanProgram = function scanProgram(
    program: ts.Program,
    files: readonly ts.SourceFile[],
): IdentifierFinding[] {
    return files
        .filter((sourceFile) => !isGenerated(sourceFile.fileName))
        .flatMap((sourceFile) => findingsIn(program, files, sourceFile));
};
