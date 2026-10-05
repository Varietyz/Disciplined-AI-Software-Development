import type { AxisBarrel, PackageJsonLike, TypeDecl, TypeEdgeContext } from "#types/code.types";
import type { TypeEdge, TypeEdgeKind, TypeGraph, TypeNode, TypeNodeKind } from "#types/graph.types";
import { PROGRAM_OPTIONS } from "#configuration/constants/program.constants";
import { hasSymbolFlag } from "#core/predicates/program.predicate";
import { nodeId } from "#core/normalizers/diagram.normalizer";
import { relFromModules } from "#core/resolvers/source.resolver";
import { resolveSourceBarrels } from "#core/resolvers/barrel.resolver";
import ts from "typescript";

const EMPTY: TypeGraph = { edges: [], nodes: [] };

const kindOfDecl = function kindOfDecl(decl: TypeDecl): TypeNodeKind {
    if (ts.isClassDeclaration(decl)) {
        return "class";
    }
    if (ts.isEnumDeclaration(decl)) {
        return "enum";
    }
    return ts.isInterfaceDeclaration(decl) ? "interface" : "type-alias";
};

const isTypeDecl = function isTypeDecl(decl: ts.Declaration): decl is TypeDecl {
    return (
        ts.isInterfaceDeclaration(decl) ||
        ts.isClassDeclaration(decl) ||
        ts.isTypeAliasDeclaration(decl) ||
        ts.isEnumDeclaration(decl)
    );
};

const typeDeclOf = function typeDeclOf(symbol: ts.Symbol, checker: ts.TypeChecker): TypeDecl | null {
    const target = hasSymbolFlag(symbol.getFlags(), ts.SymbolFlags.Alias) ? checker.getAliasedSymbol(symbol) : symbol;
    return (target.getDeclarations() ?? []).find(isTypeDecl) ?? null;
};

const declName = function declName(decl: TypeDecl): string {
    return decl.name ? decl.name.text : "";
};

const declId = function declId(decl: TypeDecl): string {
    return nodeId(`type:${decl.getSourceFile().fileName}:${declName(decl)}`);
};

const memberNames = function memberNames(decl: TypeDecl): string[] {
    if (ts.isTypeAliasDeclaration(decl)) {
        return [];
    }
    const members: readonly ts.NamedDeclaration[] = decl.members;
    return members.flatMap((member) => (member.name && ts.isIdentifier(member.name) ? [member.name.text] : []));
};

const collectRefs = function collectRefs(node: ts.Node): ts.Identifier[] {
    const out: ts.Identifier[] = ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName) ? [node.typeName] : [];
    ts.forEachChild(node, (child) => {
        out.push(...collectRefs(child));
    });
    return out;
};

const targetIdFor = function targetIdFor(ref: ts.Identifier, context: TypeEdgeContext): string | null {
    const symbol = context.checker.getSymbolAtLocation(ref);
    const decl = symbol ? typeDeclOf(symbol, context.checker) : null;
    return decl === null ? null : (context.ids.get(decl) ?? null);
};

const clauseEdges = function clauseEdges(clause: ts.HeritageClause, context: TypeEdgeContext): TypeEdge[] {
    const kind: TypeEdgeKind = clause.token === ts.SyntaxKind.ImplementsKeyword ? "implements" : "extends";
    return clause.types.flatMap((type) => {
        const to = ts.isIdentifier(type.expression) ? targetIdFor(type.expression, context) : null;
        return to !== null && to !== context.fromId ? [{ from: context.fromId, kind, to }] : [];
    });
};

const heritageEdges = function heritageEdges(decl: TypeDecl, context: TypeEdgeContext): TypeEdge[] {
    if (ts.isTypeAliasDeclaration(decl) || ts.isEnumDeclaration(decl)) {
        return [];
    }
    return (decl.heritageClauses ?? []).flatMap((clause) => clauseEdges(clause, context));
};

const referenceRoots = function referenceRoots(decl: TypeDecl): ts.Node[] {
    if (ts.isTypeAliasDeclaration(decl)) {
        return [decl.type];
    }
    if (ts.isEnumDeclaration(decl)) {
        return [];
    }
    const members: readonly ts.Node[] = decl.members;
    return members.filter(
        (member) => (ts.isPropertySignature(member) || ts.isPropertyDeclaration(member)) && Boolean(member.type),
    );
};

const referenceEdges = function referenceEdges(decl: TypeDecl, context: TypeEdgeContext): TypeEdge[] {
    const kind: TypeEdgeKind = ts.isTypeAliasDeclaration(decl) ? "uses" : "has";
    const targets = new Set(
        referenceRoots(decl)
            .flatMap(collectRefs)
            .map((ref) => targetIdFor(ref, context))
            .filter((to): to is string => to !== null && to !== context.fromId),
    );
    return [...targets].map((to) => ({ from: context.fromId, kind, to }));
};

const nodeForDecl = function nodeForDecl(decl: TypeDecl, id: string): TypeNode {
    const file = decl.getSourceFile();
    const position = file.getLineAndCharacterOfPosition(decl.getStart());
    return {
        id,
        kind: kindOfDecl(decl),
        label: declName(decl),
        members: memberNames(decl),
        source: { file: relFromModules(file.fileName), line: position.line + 1 },
    };
};

const exportedTypeDecls = function exportedTypeDecls(
    program: ts.Program,
    checker: ts.TypeChecker,
    barrel: string,
): TypeDecl[] {
    const file = program.getSourceFile(barrel);
    const moduleSymbol = file ? checker.getSymbolAtLocation(file) : undefined;
    if (!moduleSymbol) {
        return [];
    }
    return checker.getExportsOfModule(moduleSymbol).flatMap((symbol) => {
        const decl = typeDeclOf(symbol, checker);
        return decl !== null && declName(decl) !== "" ? [decl] : [];
    });
};

const collectTypeDecls = function collectTypeDecls(
    program: ts.Program,
    barrels: readonly AxisBarrel[],
): Map<TypeDecl, string> {
    const checker = program.getTypeChecker();
    const decls = new Map<TypeDecl, string>();
    for (const { barrel } of barrels) {
        for (const decl of exportedTypeDecls(program, checker, barrel)) {
            if (!decls.has(decl)) {
                decls.set(decl, declId(decl));
            }
        }
    }
    return decls;
};

export const deriveTypeGraph = function deriveTypeGraph(moduleDir: string, pkg: PackageJsonLike): TypeGraph {
    const barrels = resolveSourceBarrels(moduleDir, pkg);
    if (barrels.length === 0) {
        return EMPTY;
    }
    const program = ts.createProgram({ options: PROGRAM_OPTIONS, rootNames: barrels.map((barrel) => barrel.barrel) });
    const checker = program.getTypeChecker();
    const decls = collectTypeDecls(program, barrels);
    const nodes = [...decls].map(([decl, id]) => nodeForDecl(decl, id));
    const edges = [...decls].flatMap(([decl, id]) => {
        const context: TypeEdgeContext = { checker, fromId: id, ids: decls };
        return [...heritageEdges(decl, context), ...referenceEdges(decl, context)];
    });
    return { edges, nodes };
};
