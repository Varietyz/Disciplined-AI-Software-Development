import type { BindingContext } from "../../types/analyzer.types.ts";
import { baseChain } from "../selectors/heritage.selector.ts";
import ts from "typescript";

const BLOCKED_KINDS: ReadonlySet<ts.SyntaxKind> = new Set([
    ts.SyntaxKind.StaticKeyword,
    ts.SyntaxKind.AbstractKeyword,
    ts.SyntaxKind.DeclareKeyword,
]);

const hasKind = function hasKind(node: ts.MethodDeclaration, kinds: ReadonlySet<ts.SyntaxKind>): boolean {
    for (const modifier of node.modifiers ?? []) {
        if (kinds.has(modifier.kind)) {
            return true;
        }
    }
    return false;
};

const usesSuper = function usesSuper(node: ts.Node): boolean {
    let found = false;
    const visit = function visit(child: ts.Node): void {
        if (child.kind === ts.SyntaxKind.SuperKeyword) {
            found = true;
            return;
        }
        ts.forEachChild(child, visit);
    };
    ts.forEachChild(node, visit);
    return found;
};

const readsThisMember = function readsThisMember(node: ts.Node, name: string): boolean {
    let found = false;
    const visit = function visit(child: ts.Node): void {
        if (
            ts.isPropertyAccessExpression(child) &&
            child.expression.kind === ts.SyntaxKind.ThisKeyword &&
            child.name.getText() === name
        ) {
            found = true;
            return;
        }
        ts.forEachChild(child, visit);
    };
    visit(node);
    return found;
};

const declarationCount = function declarationCount(classNode: ts.ClassDeclaration, name: string): number {
    let count = 0;
    for (const classMember of classNode.members) {
        if (ts.isMethodDeclaration(classMember) && classMember.name.getText() === name) {
            count += 1;
        }
    }
    return count;
};

const initializedBeforeUse = function initializedBeforeUse(
    classNode: ts.ClassDeclaration,
    method: ts.MethodDeclaration,
    name: string,
): boolean {
    for (const classMember of classNode.members) {
        if (classMember === method) {
            return true;
        }
        if (
            ts.isPropertyDeclaration(classMember) &&
            classMember.initializer &&
            readsThisMember(classMember.initializer, name)
        ) {
            return false;
        }
    }
    return true;
};

const constructionReadsMember = function constructionReadsMember(node: ts.ClassLikeDeclaration, name: string): boolean {
    for (const classMember of node.members) {
        if (ts.isConstructorDeclaration(classMember) && classMember.body && readsThisMember(classMember.body, name)) {
            return true;
        }
        if (
            ts.isPropertyDeclaration(classMember) &&
            classMember.initializer &&
            readsThisMember(classMember.initializer, name)
        ) {
            return true;
        }
    }
    return false;
};

const baseConstructionReads = function baseConstructionReads(ctx: BindingContext, name: string): boolean {
    for (const base of baseChain(ctx.checker, ctx.classNode)) {
        if (constructionReadsMember(base, name)) {
            return true;
        }
    }
    return false;
};

const shapeReason = function shapeReason(method: ts.MethodDeclaration): string | null {
    if (!method.body) {
        return "no body";
    }
    if (!ts.isIdentifier(method.name)) {
        return "computed member name";
    }
    if (method.asteriskToken) {
        return "generator";
    }
    if (method.questionToken) {
        return "optional member";
    }
    if (hasKind(method, BLOCKED_KINDS)) {
        return "static, abstract or declared member";
    }
    if (ts.canHaveDecorators(method) && (ts.getDecorators(method) ?? []).length > 0) {
        return "decorated member";
    }
    return null;
};

const bindingReason = function bindingReason(
    ctx: BindingContext,
    method: ts.MethodDeclaration,
    name: string,
): string | null {
    const classSymbol = ctx.classNode.name ? (ctx.checker.getSymbolAtLocation(ctx.classNode.name) ?? null) : null;
    if (declarationCount(ctx.classNode, name) > 1) {
        return "overloaded member";
    }
    if (baseConstructionReads(ctx, name)) {
        return "base class reads the member during construction";
    }
    if (classSymbol && ctx.overrides.get(classSymbol)?.has(name) === true) {
        return "member is overridden by a subclass";
    }
    if (usesSuper(method)) {
        return "member calls super";
    }
    if (!initializedBeforeUse(ctx.classNode, method, name)) {
        return "read by an earlier field initializer";
    }
    return null;
};

export const unsafeReason = function unsafeReason(
    ctx: BindingContext,
    method: ts.MethodDeclaration,
    name: string,
): string | null {
    return shapeReason(method) ?? bindingReason(ctx, method, name);
};
