import { toPosix } from "./program.selector.ts";
import ts from "typescript";

export const within = function within(file: string, roots: readonly string[]): boolean {
    const posix = toPosix(file);
    return roots.some((root) => posix.startsWith(toPosix(root)));
};

export const keyOf = function keyOf(declaration: ts.Node): string | null {
    if (!ts.isPropertySignature(declaration)) {
        return null;
    }
    const owner = declaration.parent;
    const { name: property } = declaration;
    if (!("text" in property)) {
        return null;
    }
    const name = property.text;
    if (ts.isInterfaceDeclaration(owner)) {
        return `${owner.name.text}.${name}`;
    }
    const holder = ts.isTypeLiteralNode(owner) ? keyOf(owner.parent) : null;
    return holder === null ? null : `${holder}.${name}`;
};

export const innerTypes = function innerTypes(checker: ts.TypeChecker, type: ts.Type): readonly ts.Type[] {
    if (type.isUnion() || type.isIntersection()) {
        return type.types.flatMap((part) => innerTypes(checker, part));
    }
    const element = checker.isArrayType(type) ? type.getNumberIndexType() : undefined;
    return element === undefined ? [type] : innerTypes(checker, element);
};

const callbackOf = function callbackOf(literal: ts.Node): ts.ArrowFunction | null {
    let node = literal;
    while (ts.isParenthesizedExpression(node.parent)) {
        node = node.parent;
    }
    const holder = node.parent;
    return ts.isArrowFunction(holder) && holder.body === node ? holder : null;
};

export const declaredTarget = function declaredTarget(
    checker: ts.TypeChecker,
    literal: ts.ObjectLiteralExpression,
): ts.Type | undefined {
    const callback = callbackOf(literal);
    const call = callback?.parent;
    if (callback !== null && call !== undefined && ts.isCallExpression(call) && call.arguments.includes(callback)) {
        return checker.getContextualType(call) ?? checker.getContextualType(literal);
    }
    return checker.getContextualType(literal);
};
