import { declaredTarget, innerTypes, keyOf } from "../selectors/field.selector.ts";
import ts from "typescript";

type Marker = (checker: ts.TypeChecker, node: ts.Node, read: Set<string>) => boolean;

const GENERIC_READERS: ReadonlySet<string> = new Set(["entries", "keys", "values", "stringify"]);

const markSymbol = function markSymbol(
    checker: ts.TypeChecker,
    symbol: ts.Symbol | undefined,
    read: Set<string>,
): void {
    const roots = symbol === undefined ? [] : checker.getRootSymbols(symbol);
    const keys = roots.flatMap((root) => (root.declarations ?? []).map(keyOf));
    for (const key of keys) {
        if (key !== null) {
            read.add(key);
        }
    }
};

const markWhole = function markWhole(
    checker: ts.TypeChecker,
    node: ts.Node,
    read: Set<string>,
    kept: ReadonlySet<string> | null = null,
): void {
    const properties = innerTypes(checker, checker.getTypeAtLocation(node)).flatMap((type) =>
        checker.getPropertiesOfType(type),
    );
    for (const property of properties) {
        if (kept === null || kept.has(property.name)) {
            markSymbol(checker, property, read);
        }
    }
};

const keptBySpread = function keptBySpread(
    checker: ts.TypeChecker,
    node: ts.SpreadAssignment,
): ReadonlySet<string> | null {
    const contextual = declaredTarget(checker, node.parent);
    if (contextual === undefined) {
        return null;
    }
    const properties = innerTypes(checker, contextual).flatMap((type) => checker.getPropertiesOfType(type));
    return new Set(properties.map((property) => property.name));
};

const markAccess: Marker = (checker, node, read) => {
    if (!ts.isPropertyAccessExpression(node)) {
        return false;
    }
    markSymbol(checker, checker.getSymbolAtLocation(node.name), read);
    return true;
};

const markKeys: Marker = (checker, node, read) => {
    if (!ts.isElementAccessExpression(node)) {
        return false;
    }
    const target = checker.getTypeAtLocation(node.expression);
    for (const key of innerTypes(checker, checker.getTypeAtLocation(node.argumentExpression))) {
        if (key.isStringLiteral()) {
            markSymbol(checker, target.getProperty(key.value), read);
        }
    }
    return true;
};

const markBinding: Marker = (checker, node, read) => {
    if (!ts.isBindingElement(node) || !ts.isObjectBindingPattern(node.parent)) {
        return false;
    }
    const name = node.propertyName ?? node.name;
    const owner = checker.getTypeAtLocation(node.parent);
    markSymbol(checker, ts.isIdentifier(name) ? owner.getProperty(name.text) : undefined, read);
    return true;
};

const markSpreadAssignment: Marker = (checker, node, read) => {
    if (!ts.isSpreadAssignment(node)) {
        return false;
    }
    markWhole(checker, node.expression, read, keptBySpread(checker, node));
    return true;
};

const markSpreadElement: Marker = (checker, node, read) => {
    if (!ts.isSpreadElement(node)) {
        return false;
    }
    markWhole(checker, node.expression, read);
    return true;
};

const isGenericRead = function isGenericRead(node: ts.Node): node is ts.CallExpression {
    const callee = ts.isCallExpression(node) ? node.expression : null;
    return callee !== null && ts.isPropertyAccessExpression(callee) && GENERIC_READERS.has(callee.name.text);
};

const markGenericCall: Marker = (checker, node, read) => {
    if (!isGenericRead(node)) {
        return false;
    }
    for (const argument of node.arguments) {
        markWhole(checker, argument, read);
    }
    return true;
};

const MARKERS: readonly Marker[] = [
    markAccess,
    markKeys,
    markBinding,
    markSpreadAssignment,
    markSpreadElement,
    markGenericCall,
];

const isArgument = function isArgument(parent: ts.Node, node: ts.Node): boolean {
    return (
        ts.isExpression(node) &&
        (ts.isCallExpression(parent) || ts.isNewExpression(parent)) &&
        parent.arguments?.includes(node) === true
    );
};

const isInitializer = function isInitializer(parent: ts.Node, node: ts.Node): boolean {
    return (
        ts.isExpression(node) &&
        (ts.isVariableDeclaration(parent) || ts.isPropertyAssignment(parent)) &&
        parent.initializer === node
    );
};

const HANDING_PARENTS: readonly ((parent: ts.Node, node: ts.Node) => boolean)[] = [
    isArgument,
    isInitializer,
    (parent) => ts.isReturnStatement(parent) || ts.isArrayLiteralExpression(parent),
    (parent, node) => ts.isArrowFunction(parent) && parent.body === node,
];

const isHandedOn = function isHandedOn(node: ts.Node): node is ts.Expression {
    const literal = ts.isObjectLiteralExpression(node) || ts.isArrayLiteralExpression(node);
    return ts.isExpression(node) && !literal && HANDING_PARENTS.some((test) => test(node.parent, node));
};

const markConverted = function markConverted(checker: ts.TypeChecker, node: ts.Expression, read: Set<string>): void {
    const contextual = checker.getContextualType(node);
    if (contextual === undefined) {
        return;
    }
    const wanted = innerTypes(checker, contextual).flatMap((type) => checker.getPropertiesOfType(type));
    const properties = innerTypes(checker, checker.getTypeAtLocation(node)).flatMap((type) =>
        checker.getPropertiesOfType(type),
    );
    for (const property of properties) {
        const counterpart = wanted.find((candidate) => candidate.name === property.name);
        if (counterpart !== undefined && counterpart !== property) {
            markSymbol(checker, property, read);
        }
    }
};

export const visitRead = function visitRead(checker: ts.TypeChecker, node: ts.Node, read: Set<string>): void {
    MARKERS.some((mark) => mark(checker, node, read));
    if (isHandedOn(node)) {
        markConverted(checker, node, read);
    }
    ts.forEachChild(node, (child) => {
        visitRead(checker, child, read);
    });
};
