import type { ApiEntry, EntrySeed, ProgramAnalysis } from "#types/code.types";
import { declId, mkNodeId, sourceOf } from "#core/factories/code.typescript.factory";
import { firstDeclaration, functionOf, memberName } from "#core/selectors/code.typescript.selector";
import { inPackage, isFactoryName, isFunctionLike } from "#core/predicates/code.typescript.predicate";
import type { CallVisitor } from "#core/visitors/code.typescript.visitor";
import type { CodeGraph } from "#types/graph.types";
import type { GraphStore } from "#core/stores/graph.store";
import { MODULE_ID } from "#configuration/constants/graph.constants";
import { collectReturnedApi } from "#core/selectors/surface.selector";
import { nodeId } from "#core/normalizers/diagram.normalizer";
import ts from "typescript";

type SeedableMember = ts.ConstructorDeclaration | ts.MethodDeclaration;

const isPrivate = function isPrivate(member: ts.ClassElement): boolean {
    const modifiers = ts.canHaveModifiers(member) ? ts.getModifiers(member) : undefined;
    return (modifiers ?? []).some((modifier) => modifier.kind === ts.SyntaxKind.PrivateKeyword);
};

const seedableMember = function seedableMember(member: ts.ClassElement): member is SeedableMember {
    const callable = ts.isMethodDeclaration(member) || ts.isConstructorDeclaration(member);
    return callable && member.body !== undefined && !isPrivate(member) && memberName(member) !== null;
};

export class TsGraphBuilder {
    readonly #checker: ts.TypeChecker;
    readonly #dirPosix: string;
    readonly #program: ts.Program;
    readonly #store: GraphStore;
    readonly #visitor: CallVisitor;

    public constructor(analysis: ProgramAnalysis, store: GraphStore, visitor: CallVisitor) {
        this.#checker = analysis.checker;
        this.#program = analysis.program;
        this.#dirPosix = analysis.dirPosix;
        this.#store = store;
        this.#visitor = visitor;
    }

    public get unresolved(): number {
        return this.#store.unresolved;
    }

    public result(): CodeGraph {
        return this.#store.result();
    }

    public seedAll(seeds: readonly EntrySeed[]): void {
        for (const seed of seeds) {
            this.#seedOne(seed);
        }
    }

    #visitOnce(id: string, onFirst: () => void): void {
        if (this.#store.hasVisited(id)) {
            return;
        }
        this.#store.markVisited(id);
        onFirst();
    }

    #seedMember(member: ts.ClassElement, parentId: string): void {
        if (!seedableMember(member) || !member.body) {
            return;
        }
        const { body } = member;
        const mid = mkNodeId(member);
        this.#store.pushEdge({ from: parentId, kind: "call", to: mid });
        this.#visitOnce(mid, () => {
            this.#store.addNode({ id: mid, kind: "method", label: memberName(member) ?? "", source: sourceOf(member) });
            this.#visitor.walk(body, mid);
        });
    }

    #seedClassMethods(classDecl: ts.ClassDeclaration, parentId: string): void {
        for (const member of classDecl.members) {
            this.#seedMember(member, parentId);
        }
    }

    #seedClass(classDecl: ts.ClassDeclaration, name: string): void {
        const id = declId(classDecl);
        this.#visitOnce(id, () => {
            this.#store.addNode({ id, kind: "entry", label: name, source: sourceOf(classDecl) });
            this.#seedClassMethods(classDecl, id);
        });
    }

    #newClassIn(expr: ts.Expression, seen: Set<number>): ts.ClassDeclaration[] {
        const inner = ts.isParenthesizedExpression(expr) ? expr.expression : expr;
        if (!ts.isNewExpression(inner) || !ts.isIdentifier(inner.expression)) {
            return [];
        }
        const symbol = this.#checker.getSymbolAtLocation(inner.expression);
        const decl = symbol ? firstDeclaration(symbol, this.#checker) : null;
        if (
            decl === null ||
            !ts.isClassDeclaration(decl) ||
            !inPackage(decl, this.#dirPosix) ||
            seen.has(decl.getStart())
        ) {
            return [];
        }
        seen.add(decl.getStart());
        return [decl];
    }

    #returnedClasses(fn: ts.FunctionLikeDeclaration): ts.ClassDeclaration[] {
        const seen = new Set<number>();
        if (!fn.body) {
            return [];
        }
        return ts.isBlock(fn.body) ? this.#returnedClassesInBlock(fn.body, seen) : this.#newClassIn(fn.body, seen);
    }

    #returnedClassesInBlock(body: ts.Block, seen: Set<number>): ts.ClassDeclaration[] {
        const out: ts.ClassDeclaration[] = [];
        const visit = (node: ts.Node): void => {
            if (node !== body && isFunctionLike(node)) {
                return;
            }
            if (ts.isReturnStatement(node) && node.expression) {
                out.push(...this.#newClassIn(node.expression, seen));
            }
            ts.forEachChild(node, visit);
        };
        ts.forEachChild(body, visit);
        return out;
    }

    #seedOne(seed: EntrySeed): void {
        const file = this.#program.getSourceFile(seed.barrel);
        if (!file) {
            return;
        }
        if (seed.name === MODULE_ID) {
            this.#seedModule(seed, file);
            return;
        }
        const decl = this.#exportedDecl(file, seed.name);
        const fn = decl === null ? null : functionOf(decl);
        if (decl !== null && fn !== null) {
            this.#seedFunction(seed, decl, fn);
            return;
        }
        if (decl !== null && ts.isClassDeclaration(decl)) {
            this.#seedClass(decl, seed.label);
        }
    }

    #seedModule(seed: EntrySeed, file: ts.SourceFile): void {
        const id = nodeId(`module:${seed.barrel}`);
        this.#visitOnce(id, () => {
            this.#store.addNode({ id, kind: "entry", label: seed.label, source: sourceOf(file) });
            this.#visitor.walk(file, id);
        });
    }

    #exportedDecl(file: ts.SourceFile, name: string): ts.Declaration | null {
        const moduleSymbol = this.#checker.getSymbolAtLocation(file);
        const exported = moduleSymbol
            ? this.#checker.getExportsOfModule(moduleSymbol).find((symbol) => symbol.name === name)
            : undefined;
        return exported ? firstDeclaration(exported, this.#checker) : null;
    }

    #seedFunction(seed: EntrySeed, decl: ts.Declaration, fn: ts.FunctionLikeDeclaration): void {
        const id = declId(decl);
        this.#visitOnce(id, () => {
            const kind = isFactoryName(seed.label) ? "factory" : "entry";
            this.#store.addNode({ id, kind, label: seed.label, source: sourceOf(decl) });
            this.#walkFunctionBody(id, fn);
        });
    }

    #walkFunctionBody(id: string, fn: ts.FunctionLikeDeclaration): void {
        if (!fn.body) {
            return;
        }
        this.#visitor.walk(fn.body, id);
        for (const api of collectReturnedApi(this.#checker, fn)) {
            this.#seedApi(id, api);
        }
        for (const cls of this.#returnedClasses(fn)) {
            this.#seedClassMethods(cls, id);
        }
    }

    #seedApi(id: string, api: ApiEntry): void {
        const mid = mkNodeId(api.fn);
        this.#store.pushEdge({ from: id, kind: "call", to: mid });
        this.#visitOnce(mid, () => {
            this.#store.addNode({ id: mid, kind: "method", label: api.name, source: sourceOf(api.fn) });
            if (api.fn.body && ts.isBlock(api.fn.body)) {
                this.#visitor.walk(api.fn.body, mid);
            }
        });
    }
}
