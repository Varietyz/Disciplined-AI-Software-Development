import { hasSymbolFlag } from "#core/predicates/program.predicate";
import { isFunctionLike } from "#core/predicates/code.typescript.predicate";
import ts from "typescript";

const MIN_UNION_MEMBERS = 3;
const ANONYMOUS = "anonymous";
const CONSTRUCTOR = "constructor";
const PRIVATE_MARK = "#";

export const communicationObjName = function communicationObjName(objExpr: ts.Expression): string | null {
    if (ts.isIdentifier(objExpr)) {
        return objExpr.text;
    }
    if (ts.isPropertyAccessExpression(objExpr) && objExpr.expression.kind === ts.SyntaxKind.ThisKeyword) {
        const { text } = objExpr.name;
        return text.startsWith(PRIVATE_MARK) ? text.slice(1) : text;
    }
    return null;
};

export const unionStringLiterals = function unionStringLiterals(typeNode: ts.TypeNode): string[] | null {
    if (!ts.isUnionTypeNode(typeNode)) {
        return null;
    }
    const out: string[] = [];
    for (const member of typeNode.types) {
        if (!ts.isLiteralTypeNode(member) || !ts.isStringLiteral(member.literal)) {
            return null;
        }
        out.push(member.literal.text);
    }
    return out.length >= MIN_UNION_MEMBERS ? out : null;
};

const initializerFunction = function initializerFunction(decl: ts.Node): ts.FunctionLikeDeclaration | null {
    if (!ts.isVariableDeclaration(decl) || !decl.initializer) {
        return null;
    }
    const init = decl.initializer;
    return ts.isArrowFunction(init) || ts.isFunctionExpression(init) ? init : null;
};

export const functionOf = function functionOf(decl: ts.Node | null | undefined): ts.FunctionLikeDeclaration | null {
    if (!decl) {
        return null;
    }
    return isFunctionLike(decl) ? decl : initializerFunction(decl);
};

export const declName = function declName(decl: ts.Declaration): string {
    const name = ts.getNameOfDeclaration(decl);
    if (name && ts.isIdentifier(name)) {
        return name.text;
    }
    const { parent } = decl;
    if (ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) {
        return parent.name.text;
    }
    if (ts.isVariableDeclaration(decl) && ts.isIdentifier(decl.name)) {
        return decl.name.text;
    }
    return ANONYMOUS;
};

export const firstDeclaration = function firstDeclaration(
    symbol: ts.Symbol,
    checker: ts.TypeChecker,
): ts.Declaration | null {
    const target = hasSymbolFlag(symbol.flags, ts.SymbolFlags.Alias) ? checker.getAliasedSymbol(symbol) : symbol;
    return target.declarations?.[0] ?? null;
};

export const memberName = function memberName(member: ts.ClassElement): string | null {
    if (ts.isConstructorDeclaration(member)) {
        return CONSTRUCTOR;
    }
    return member.name && ts.isIdentifier(member.name) ? member.name.text : null;
};
