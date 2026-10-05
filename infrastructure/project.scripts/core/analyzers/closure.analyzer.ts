import type { Atom, FieldEntry, FileFlags, GraphDelta } from "#types/closure.types";
import { ICONS_SUFFIX, IDS_SUFFIX, ID_PROPERTIES, STRINGS_SUFFIX } from "#configuration/constants/closure.constants";
import { callDelta, exportDelta } from "#core/converters/closure.converter";
import { normalizePath } from "@ssot/govlab/shared/resolvers/anchor.resolver.ts";
import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { resolveSelfImport } from "#core/resolvers/specifier.resolver";
import ts from "typescript";

interface FileScope {
    readonly flags: FileFlags;
    readonly relPath: string;
    readonly sourceFile: ts.SourceFile;
    readonly targets: ReadonlyMap<string, string>;
}

const atomOf = function atomOf(expr: ts.Expression | undefined, sourceFile: ts.SourceFile): Atom | null {
    if (expr === undefined) {
        return null;
    }
    if (ts.isIdentifier(expr)) {
        return { kind: "ident", text: expr.text };
    }
    if (ts.isStringLiteral(expr)) {
        return { kind: "literal", text: expr.text };
    }
    return ts.isPropertyAccessExpression(expr) ? { kind: "ident", text: expr.getText(sourceFile) } : null;
};

const idArgOf = function idArgOf(expr: ts.Expression | undefined, sourceFile: ts.SourceFile): Atom | null {
    const atom = atomOf(expr, sourceFile);
    if (atom !== null || expr === undefined || !ts.isObjectLiteralExpression(expr)) {
        return atom;
    }
    const found = expr.properties
        .filter((prop): prop is ts.PropertyAssignment => ts.isPropertyAssignment(prop))
        .filter((prop) => ts.isIdentifier(prop.name) && ID_PROPERTIES.has(prop.name.text))
        .map((prop) => atomOf(prop.initializer, sourceFile))
        .find((candidate) => candidate !== null);
    return found ?? null;
};

const consumerOf = function consumerOf(node: ts.Node): ts.Node {
    let current = node.parent;
    while (ts.isAwaitExpression(current) || ts.isParenthesizedExpression(current)) {
        current = current.parent;
    }
    return current;
};

const importDelta = function importDelta(file: string, from: string, names: readonly string[]): GraphDelta {
    return names.length === 0 ? { sideEffectImports: [{ file, from }] } : { imports: [{ file, from, names }] };
};

const dynamicImportDelta = function dynamicImportDelta(node: ts.CallExpression, scope: FileScope): GraphDelta {
    const specifier = node.arguments.at(0);
    if (specifier === undefined || !ts.isStringLiteral(specifier)) {
        return {};
    }
    const consumer = consumerOf(node);
    const names = ts.isPropertyAccessExpression(consumer) ? [consumer.name.text] : [];
    return importDelta(scope.relPath, resolveSelfImport(scope.targets, specifier.text, scope.relPath), names);
};

const callExpressionDelta = function callExpressionDelta(node: ts.CallExpression, scope: FileScope): GraphDelta {
    if (node.expression.kind === ts.SyntaxKind.ImportKeyword) {
        return dynamicImportDelta(node, scope);
    }
    if (!ts.isIdentifier(node.expression)) {
        return {};
    }
    const idArg = idArgOf(node.arguments[0], scope.sourceFile);
    return callDelta({ file: scope.relPath, fn: node.expression.text, idArg }, idArg);
};

const fieldOf = function fieldOf(member: ts.TypeElement): FieldEntry[] {
    return ts.isPropertySignature(member) && ts.isIdentifier(member.name)
        ? [{ name: member.name.text, optional: member.questionToken !== undefined }]
        : [];
};

const isExported = function isExported(modifiers: ts.NodeArray<ts.ModifierLike> | undefined): boolean {
    return modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) === true;
};

const variableDelta = function variableDelta(node: ts.VariableStatement, scope: FileScope): GraphDelta {
    if (!isExported(node.modifiers)) {
        return {};
    }
    const names = node.declarationList.declarations.flatMap((declaration) =>
        ts.isIdentifier(declaration.name) ? [declaration.name.text] : [],
    );
    return exportDelta(names, scope.relPath, scope.flags);
};

const importedNames = function importedNames(clause: ts.ImportClause | undefined): string[] {
    if (clause === undefined) {
        return [];
    }
    const bindings = clause.namedBindings;
    const named = bindings && ts.isNamedImports(bindings) ? bindings.elements : [];
    return [
        ...named.map((element) => element.propertyName?.text ?? element.name.text),
        ...(clause.name ? [clause.name.text] : []),
    ];
};

const exportDeclarationDelta = function exportDeclarationDelta(
    node: ts.ExportDeclaration,
    scope: FileScope,
): GraphDelta {
    if (!node.exportClause || !ts.isNamedExports(node.exportClause)) {
        return {};
    }
    const { elements } = node.exportClause;
    const exported = exportDelta(
        elements.map((element) => element.name.text),
        scope.relPath,
        scope.flags,
    );
    const spec = node.moduleSpecifier;
    if (spec === undefined || !ts.isStringLiteral(spec)) {
        return exported;
    }
    const from = resolveSelfImport(scope.targets, spec.text, scope.relPath);
    const names = elements.map((element) => element.propertyName?.text ?? element.name.text);
    return { ...exported, imports: [{ file: scope.relPath, from, names }] };
};

const ownDelta = function ownDelta(node: ts.Node, scope: FileScope): GraphDelta {
    if (ts.isCallExpression(node)) {
        return callExpressionDelta(node, scope);
    }
    if (ts.isInterfaceDeclaration(node)) {
        return { interfaces: [{ fields: node.members.flatMap(fieldOf), file: scope.relPath, name: node.name.text }] };
    }
    if (ts.isVariableStatement(node)) {
        return variableDelta(node, scope);
    }
    if (ts.isFunctionDeclaration(node)) {
        return isExported(node.modifiers) && node.name
            ? { exports: [{ file: scope.relPath, name: node.name.text }] }
            : {};
    }
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        const from = resolveSelfImport(scope.targets, node.moduleSpecifier.text, scope.relPath);
        return importDelta(scope.relPath, from, importedNames(node.importClause));
    }
    return ts.isExportDeclaration(node) ? exportDeclarationDelta(node, scope) : {};
};

export const flagsOf = function flagsOf(relPath: string): FileFlags {
    return {
        isIcons: relPath.endsWith(ICONS_SUFFIX),
        isIds: relPath.endsWith(IDS_SUFFIX),
        isStrings: relPath.endsWith(STRINGS_SUFFIX),
    };
};

export const fileDeltas = function fileDeltas(
    filePath: string,
    root: string,
    targets: ReadonlyMap<string, string>,
): GraphDelta[] {
    const sourceFile = ts.createSourceFile(filePath, readFileSync(filePath, "utf8"), ts.ScriptTarget.Latest, true);
    const relPath = normalizePath(relative(root, filePath));
    const scope: FileScope = { flags: flagsOf(relPath), relPath, sourceFile, targets };
    const deltas: GraphDelta[] = [];
    const visit = function visit(node: ts.Node): void {
        deltas.push(ownDelta(node, scope));
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);
    return deltas;
};
