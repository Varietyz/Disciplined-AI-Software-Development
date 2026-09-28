import { declaredTarget, innerTypes, keyOf, within } from "../selectors/field.selector.ts";
import { lineOf, programFor, toPosix } from "../selectors/program.selector.ts";
import type { FieldScope } from "../../types/field.types.ts";
import type { PlainClosedValue } from "../../types/analyzer.types.ts";
import { relative } from "node:path";
import ts from "typescript";

const isLiteralSet = function isLiteralSet(checker: ts.TypeChecker, type: ts.Type): boolean {
    const parts = innerTypes(checker, type);
    return parts.length > 0 && parts.every((part) => part.isStringLiteral());
};

const vocabularyOf = function vocabularyOf(
    checker: ts.TypeChecker,
    value: ts.Expression,
    typeRoots: readonly string[],
): string | null {
    const named = ts.isPropertyAccessExpression(value) ? value.name : value;
    const declaration = checker.getSymbolAtLocation(named)?.declarations?.[0];
    if (
        declaration === undefined ||
        !ts.isPropertySignature(declaration) ||
        declaration.type === undefined ||
        !within(declaration.getSourceFile().fileName, typeRoots)
    ) {
        return null;
    }
    return isLiteralSet(checker, checker.getTypeAtLocation(value)) ? declaration.type.getText() : null;
};

const isPlainString = function isPlainString(checker: ts.TypeChecker, type: ts.Type): boolean {
    return innerTypes(checker, type).some((part) => (part.flags & ts.TypeFlags.String) !== 0);
};

interface Target {
    readonly key: string;
    readonly type: ts.Type;
}

const targetOf = function targetOf(
    checker: ts.TypeChecker,
    node: ts.PropertyAssignment | ts.ShorthandPropertyAssignment,
): Target | null {
    const declared = ts.isObjectLiteralExpression(node.parent) ? declaredTarget(checker, node.parent) : undefined;
    const name = node.name.getText();
    for (const type of declared === undefined ? [] : innerTypes(checker, declared)) {
        const property = type.getProperty(name);
        const declaration = property?.declarations?.[0];
        const key = declaration === undefined ? null : keyOf(declaration);
        if (property !== undefined && key !== null) {
            return { key, type: checker.getTypeOfSymbol(property) };
        }
    }
    return null;
};

const assignedValue = function assignedValue(node: ts.Node): ts.Expression | null {
    if (ts.isPropertyAssignment(node)) {
        return node.initializer;
    }
    return ts.isShorthandPropertyAssignment(node) ? node.name : null;
};

const plainValueAt = function plainValueAt(
    checker: ts.TypeChecker,
    node: ts.Node,
    scope: FieldScope,
): PlainClosedValue | null {
    const value = assignedValue(node);
    if (value === null || !(ts.isPropertyAssignment(node) || ts.isShorthandPropertyAssignment(node))) {
        return null;
    }
    const vocabulary = vocabularyOf(checker, value, scope.typeRoots);
    const target = vocabulary === null ? null : targetOf(checker, node);
    if (vocabulary === null || target === null || !isPlainString(checker, target.type)) {
        return null;
    }
    const source = node.getSourceFile();
    return {
        file: toPosix(relative(process.cwd(), source.fileName)),
        line: lineOf(source, node),
        target: target.key,
        vocabulary,
    };
};

const childrenOf = function childrenOf(node: ts.Node): readonly ts.Node[] {
    const children: ts.Node[] = [];
    ts.forEachChild(node, (child) => {
        children.push(child);
    });
    return children;
};

const valuesUnder = function valuesUnder(
    checker: ts.TypeChecker,
    node: ts.Node,
    scope: FieldScope,
): readonly PlainClosedValue[] {
    const here = plainValueAt(checker, node, scope);
    const below = childrenOf(node).flatMap((child) => valuesUnder(checker, child, scope));
    return here === null ? below : [here, ...below];
};

export const plainClosedValues = function plainClosedValues(scope: FieldScope): readonly PlainClosedValue[] {
    const program = programFor(scope.tsconfig);
    const checker = program.getTypeChecker();
    return program
        .getSourceFiles()
        .filter((source) => !source.isDeclarationFile && within(source.fileName, scope.readerRoots))
        .flatMap((source) => valuesUnder(checker, source, scope));
};
