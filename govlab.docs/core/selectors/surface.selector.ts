import type { ApiEntry, PropTarget } from "#types/code.types";
import { firstDeclaration, functionOf } from "#core/selectors/code.typescript.selector";
import { isFunctionLike } from "#core/predicates/code.typescript.predicate";
import ts from "typescript";

const throughIdentifier = function throughIdentifier(
    checker: ts.TypeChecker,
    expr: ts.Identifier,
): ts.Expression | null {
    const symbol = checker.getSymbolAtLocation(expr);
    const decl = symbol ? firstDeclaration(symbol, checker) : null;
    return decl !== null && ts.isVariableDeclaration(decl) && decl.initializer ? decl.initializer : null;
};

const unwrapToLiteral = function unwrapToLiteral(checker: ts.TypeChecker, expr: ts.Expression): ts.Expression | null {
    if (ts.isParenthesizedExpression(expr)) {
        return expr.expression;
    }
    if (ts.isCallExpression(expr) && expr.arguments.length > 0) {
        return expr.arguments[0] ?? null;
    }
    return ts.isIdentifier(expr) ? throughIdentifier(checker, expr) : null;
};

const objectLiteralOf = function objectLiteralOf(
    checker: ts.TypeChecker,
    expr: ts.Expression | undefined,
): ts.ObjectLiteralExpression | null {
    if (!expr) {
        return null;
    }
    if (ts.isObjectLiteralExpression(expr)) {
        return expr;
    }
    const inner = unwrapToLiteral(checker, expr);
    return inner === null ? null : objectLiteralOf(checker, inner);
};

const resolveFn = function resolveFn(checker: ts.TypeChecker, idNode: ts.Node): ts.FunctionLikeDeclaration | null {
    const symbol = checker.getSymbolAtLocation(idNode);
    return functionOf(symbol ? firstDeclaration(symbol, checker) : null);
};

const assignmentTarget = function assignmentTarget(
    checker: ts.TypeChecker,
    init: ts.Expression,
): ts.FunctionLikeDeclaration | null {
    if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) {
        return init;
    }
    return ts.isIdentifier(init) ? resolveFn(checker, init) : null;
};

const propTarget = function propTarget(checker: ts.TypeChecker, prop: ts.ObjectLiteralElementLike): PropTarget | null {
    if (ts.isPropertyAssignment(prop) && (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name))) {
        return { name: prop.name.text, target: assignmentTarget(checker, prop.initializer) };
    }
    if (ts.isMethodDeclaration(prop) && ts.isIdentifier(prop.name)) {
        return { name: prop.name.text, target: prop };
    }
    if (ts.isShorthandPropertyAssignment(prop)) {
        const value = checker.getShorthandAssignmentValueSymbol(prop);
        return { name: prop.name.text, target: functionOf(value ? firstDeclaration(value, checker) : null) };
    }
    return null;
};

const returnedApiFromObject = function returnedApiFromObject(
    checker: ts.TypeChecker,
    obj: ts.ObjectLiteralExpression,
    seen: Set<string>,
): ApiEntry[] {
    const out: ApiEntry[] = [];
    for (const prop of obj.properties) {
        const target = propTarget(checker, prop);
        if (target?.target?.body && !seen.has(target.name)) {
            seen.add(target.name);
            out.push({ fn: target.target, name: target.name });
        }
    }
    return out;
};

const returnsInBlock = function returnsInBlock(checker: ts.TypeChecker, body: ts.Block, seen: Set<string>): ApiEntry[] {
    const out: ApiEntry[] = [];
    const visit = (node: ts.Node): void => {
        if (node !== body && isFunctionLike(node)) {
            return;
        }
        const obj = ts.isReturnStatement(node) ? objectLiteralOf(checker, node.expression) : null;
        if (obj !== null) {
            out.push(...returnedApiFromObject(checker, obj, seen));
        }
        ts.forEachChild(node, visit);
    };
    ts.forEachChild(body, visit);
    return out;
};

export const collectReturnedApi = function collectReturnedApi(
    checker: ts.TypeChecker,
    fn: ts.FunctionLikeDeclaration,
): ApiEntry[] {
    const seen = new Set<string>();
    if (!fn.body) {
        return [];
    }
    if (ts.isBlock(fn.body)) {
        return returnsInBlock(checker, fn.body, seen);
    }
    const obj = objectLiteralOf(checker, fn.body);
    return obj === null ? [] : returnedApiFromObject(checker, obj, seen);
};
