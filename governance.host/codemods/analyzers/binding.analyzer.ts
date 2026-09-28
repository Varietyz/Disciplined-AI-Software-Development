import type { BindingContext, BindingFinding } from "../../types/analyzer.types.ts";
import { clausesOfToken, implementsClauses, memberNamesOf } from "../selectors/heritage.selector.ts";
import { lineOf, relPath } from "../selectors/program.selector.ts";
import ts from "typescript";
import { unsafeReason } from "../predicates/binding.predicate.ts";

const callableFieldDecl = function callableFieldDecl(
    checker: ts.TypeChecker,
    member: ts.Symbol,
): ts.PropertySignature | null {
    const decl = member.valueDeclaration ?? member.declarations?.[0] ?? null;
    if (!decl || !ts.isPropertySignature(decl)) {
        return null;
    }
    return checker.getTypeOfSymbolAtLocation(member, decl).getCallSignatures().length > 0 ? decl : null;
};

const methodImplementing = function methodImplementing(
    classNode: ts.ClassDeclaration,
    name: string,
): ts.MethodDeclaration | null {
    for (const classMember of classNode.members) {
        if (ts.isMethodDeclaration(classMember) && classMember.name.getText() === name) {
            return classMember;
        }
    }
    return null;
};

const findingForMember = function findingForMember(
    ctx: BindingContext,
    interfaceName: string,
    member: ts.Symbol,
): BindingFinding | null {
    const decl = callableFieldDecl(ctx.checker, member);
    if (!decl) {
        return null;
    }
    const name = member.getName();
    const implementation = methodImplementing(ctx.classNode, name);
    if (!implementation) {
        return null;
    }
    const memberSource = decl.getSourceFile();
    return {
        end: implementation.getEnd(),
        file: relPath(ctx.sourceFile.fileName),
        fileName: ctx.sourceFile.fileName,
        iface: interfaceName,
        ifaceFile: relPath(memberSource.fileName),
        ifaceLine: lineOf(memberSource, decl),
        line: lineOf(ctx.sourceFile, implementation),
        member: name,
        method: implementation,
        reason: unsafeReason(ctx, implementation, name),
        start: implementation.getStart(ctx.sourceFile),
    };
};

const findingsForImplements = function findingsForImplements(
    ctx: BindingContext,
    typeExpr: ts.ExpressionWithTypeArguments,
): BindingFinding[] {
    const ifaceType = ctx.checker.getTypeAtLocation(typeExpr.expression);
    const iface = ifaceType.getSymbol()?.getName() ?? "<interface>";
    const out: BindingFinding[] = [];
    for (const member of ifaceType.getProperties()) {
        const finding = findingForMember(ctx, iface, member);
        if (finding) {
            out.push(finding);
        }
    }
    return out;
};

const overridesOf = function overridesOf(
    checker: ts.TypeChecker,
    node: ts.ClassLikeDeclaration,
): [ts.Symbol, string[]][] {
    const out: [ts.Symbol, string[]][] = [];
    for (const typeExpr of clausesOfToken(node, ts.SyntaxKind.ExtendsKeyword)) {
        const symbol = checker.getSymbolAtLocation(typeExpr.expression);
        if (symbol) {
            out.push([symbol, memberNamesOf(node)]);
        }
    }
    return out;
};

const classesIn = function classesIn(sourceFile: ts.SourceFile): ts.ClassLikeDeclaration[] {
    const out: ts.ClassLikeDeclaration[] = [];
    const visit = function visit(node: ts.Node): void {
        if (ts.isClassDeclaration(node) || ts.isClassExpression(node)) {
            out.push(node);
        }
        ts.forEachChild(node, visit);
    };
    ts.forEachChild(sourceFile, visit);
    return out;
};

export const collectOverrides = function collectOverrides(
    checker: ts.TypeChecker,
    sourceFiles: readonly ts.SourceFile[],
): Map<ts.Symbol, Set<string>> {
    const out = new Map<ts.Symbol, Set<string>>();
    const pairs = sourceFiles.flatMap((sourceFile) =>
        classesIn(sourceFile).flatMap((node) => overridesOf(checker, node)),
    );
    for (const [symbol, names] of pairs) {
        out.set(symbol, new Set([...(out.get(symbol) ?? []), ...names]));
    }
    return out;
};

export const scanSourceFile = function scanSourceFile(
    typeChecker: ts.TypeChecker,
    source: ts.SourceFile,
    overrideMap: ReadonlyMap<ts.Symbol, ReadonlySet<string>>,
): BindingFinding[] {
    const out: BindingFinding[] = [];
    const contextFor = function contextFor(declaration: ts.ClassDeclaration): BindingContext {
        return { checker: typeChecker, classNode: declaration, overrides: overrideMap, sourceFile: source };
    };
    const visit = function visit(node: ts.Node): void {
        if (ts.isClassDeclaration(node)) {
            const ctx = contextFor(node);
            for (const typeExpr of implementsClauses(typeChecker, node)) {
                out.push(...findingsForImplements(ctx, typeExpr));
            }
        }
        ts.forEachChild(node, visit);
    };
    ts.forEachChild(source, visit);
    return out;
};
