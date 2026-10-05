import type { BarrelExport } from "#types/code.types";
import { DEFAULT_LABEL } from "#configuration/constants/graph.constants";
import { isCodeFile } from "#core/predicates/source.predicate";
import { readTextSafe } from "#core/loaders/base.loader";
import ts from "typescript";

type NamedDeclaration =
    | ts.ClassDeclaration
    | ts.EnumDeclaration
    | ts.FunctionDeclaration
    | ts.InterfaceDeclaration
    | ts.TypeAliasDeclaration;

const hasModifier = function hasModifier(node: ts.Node, kind: ts.SyntaxKind): boolean {
    return ts.canHaveModifiers(node) && (ts.getModifiers(node) ?? []).some((modifier) => modifier.kind === kind);
};

const isExported = function isExported(node: ts.Node): boolean {
    return hasModifier(node, ts.SyntaxKind.ExportKeyword);
};

const isNamedDeclaration = function isNamedDeclaration(node: ts.Node): node is NamedDeclaration {
    if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
        return true;
    }
    return ts.isInterfaceDeclaration(node) || ts.isEnumDeclaration(node) || ts.isTypeAliasDeclaration(node);
};

const variableNames = function variableNames(node: ts.VariableStatement): string[] {
    return node.declarationList.declarations.flatMap((decl) => (ts.isIdentifier(decl.name) ? [decl.name.text] : []));
};

const clauseNames = function clauseNames(node: ts.ExportDeclaration, valuesOnly: boolean): string[] {
    const clause = node.exportClause;
    if (!clause || !ts.isNamedExports(clause) || (valuesOnly && node.isTypeOnly)) {
        return [];
    }
    return clause.elements.filter((element) => !valuesOnly || !element.isTypeOnly).map((element) => element.name.text);
};

const exportsFromNode = function exportsFromNode(node: ts.Node): string[] {
    if (ts.isExportDeclaration(node)) {
        return clauseNames(node, false);
    }
    if (!isExported(node)) {
        return [];
    }
    if (ts.isVariableStatement(node)) {
        return variableNames(node);
    }
    return isNamedDeclaration(node) && node.name !== undefined ? [node.name.text] : [];
};

const sourceOf = function sourceOf(filePath: string, kind?: ts.ScriptKind): ts.SourceFile | null {
    const text = readTextSafe(filePath);
    return text === null ? null : ts.createSourceFile(filePath, text, ts.ScriptTarget.ESNext, true, kind);
};

export const exportedNames = function exportedNames(filePath: string): ReadonlySet<string> {
    const source = isCodeFile(filePath) ? sourceOf(filePath) : null;
    return new Set(source === null ? [] : source.statements.flatMap(exportsFromNode));
};

const declarationPair = function declarationPair(stmt: ts.ClassDeclaration | ts.FunctionDeclaration): BarrelExport {
    const label = stmt.name?.text ?? DEFAULT_LABEL;
    return { label, name: hasModifier(stmt, ts.SyntaxKind.DefaultKeyword) ? DEFAULT_LABEL : label };
};

const valuePairs = function valuePairs(stmt: ts.Statement): BarrelExport[] {
    if (ts.isExportDeclaration(stmt)) {
        return clauseNames(stmt, true).map((name) => ({ label: name, name }));
    }
    if ((ts.isFunctionDeclaration(stmt) || ts.isClassDeclaration(stmt)) && isExported(stmt)) {
        return [declarationPair(stmt)];
    }
    if (ts.isVariableStatement(stmt) && isExported(stmt)) {
        return variableNames(stmt).map((name) => ({ label: name, name }));
    }
    if (ts.isExportAssignment(stmt) && stmt.isExportEquals !== true) {
        const label = ts.isIdentifier(stmt.expression) ? stmt.expression.text : DEFAULT_LABEL;
        return [{ label, name: DEFAULT_LABEL }];
    }
    return [];
};

export const barrelExports = function barrelExports(barrelPath: string): BarrelExport[] {
    const source = sourceOf(barrelPath, ts.ScriptKind.JS);
    const byName = new Map<string, string>();
    for (const stmt of source?.statements ?? []) {
        for (const { name, label } of valuePairs(stmt)) {
            byName.set(name, label);
        }
    }
    return [...byName].map(([name, label]) => ({ label, name }));
};
