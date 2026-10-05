import { BUILTIN_METHODS, LIB_OBJECTS } from "#configuration/constants/code.typescript.constants";
import type { CallContext, CollaboratorSpec, Recognizer, WalkerContext } from "#types/code.types";
import { communicationObjName, declName, firstDeclaration, functionOf } from "#core/selectors/code.typescript.selector";
import { declId, mkNodeId, sourceOf } from "#core/factories/code.typescript.factory";
import { inPackage, isFactoryName } from "#core/predicates/code.typescript.predicate";
import { GRAPH_LABELS } from "#configuration/strings/graph.strings";
import type { GraphStore } from "#core/stores/graph.store";
import { nodeId } from "#core/normalizers/diagram.normalizer";
import ts from "typescript";

export class CallVisitor {
    readonly #checker: ts.TypeChecker;
    readonly #program: ts.Program;
    readonly #dirPosix: string;
    readonly #store: GraphStore;
    readonly #recognizers: readonly Recognizer[];

    public constructor(context: WalkerContext) {
        this.#checker = context.checker;
        this.#program = context.program;
        this.#dirPosix = context.dirPosix;
        this.#store = context.store;
        this.#recognizers = context.recognizers;
    }

    public walk(body: ts.Node, currentId: string): void {
        const visit = (child: ts.Node): void => {
            this.#runRecognizers(child, currentId);
            if (ts.isCallExpression(child)) {
                this.#classifyCall(child, currentId);
            }
            if (ts.isNewExpression(child)) {
                this.#classifyNew(child, currentId);
            }
            ts.forEachChild(child, visit);
        };
        ts.forEachChild(body, visit);
    }

    #declarationOf(expression: ts.Expression): ts.Declaration | null {
        const symbol = this.#checker.getSymbolAtLocation(expression);
        return symbol ? firstDeclaration(symbol, this.#checker) : null;
    }

    #classifyNew(child: ts.NewExpression, currentId: string): void {
        if (!ts.isIdentifier(child.expression)) {
            return;
        }
        const decl = this.#declarationOf(child.expression);
        if (decl === null || !ts.isClassDeclaration(decl) || !inPackage(decl, this.#dirPosix)) {
            return;
        }
        const cid = declId(decl);
        this.#store.addNode({ id: cid, kind: "collaborator", label: declName(decl), source: sourceOf(decl) });
        this.#store.pushEdge({ from: currentId, kind: "dependency", label: GRAPH_LABELS.constructs, to: cid });
    }

    #runRecognizers(child: ts.Node, currentId: string): void {
        const context = { currentId, mkNodeId, sourceOf };
        for (const recognizer of this.#recognizers) {
            const result = recognizer.classify(child, context);
            for (const node of result?.nodes ?? []) {
                this.#store.addNode(node);
            }
            for (const edge of result?.edges ?? []) {
                this.#store.pushEdge(edge);
            }
        }
    }

    #classifyCall(child: ts.CallExpression, currentId: string): void {
        const sym = this.#checker.getSymbolAtLocation(child.expression);
        const decl = sym ? firstDeclaration(sym, this.#checker) : null;
        const context: CallContext = { child, currentId, decl, fn: functionOf(decl), sym };
        if (decl !== null && context.fn !== null && inPackage(decl, this.#dirPosix)) {
            this.#handleInPackageCall(decl, context.fn, currentId);
            return;
        }
        if (ts.isIdentifier(child.expression)) {
            this.#handleIdentifierCall(context, child.expression);
            return;
        }
        if (ts.isPropertyAccessExpression(child.expression) && ts.isIdentifier(child.expression.name)) {
            this.#handlePropertyCall(context, child.expression);
            return;
        }
        this.#bumpUnresolved(sym);
    }

    #bumpUnresolved(sym: ts.Symbol | undefined): void {
        if (!sym) {
            this.#store.bumpUnresolved();
        }
    }

    #collaborator(spec: CollaboratorSpec): void {
        this.#store.addNode({ id: spec.cid, kind: "collaborator", label: spec.label, source: spec.source });
        this.#store.pushEdge({
            from: spec.currentId,
            kind: "call",
            ...(typeof spec.edgeLabel === "string" ? { label: spec.edgeLabel } : {}),
            to: spec.cid,
        });
    }

    #handleInPackageCall(decl: ts.Declaration, fn: ts.FunctionLikeDeclaration, currentId: string): void {
        const cid = declId(decl);
        this.#store.pushEdge({ from: currentId, kind: "call", to: cid });
        if (this.#store.hasVisited(cid)) {
            this.#store.pushEdge({ from: currentId, kind: "loop", to: cid });
            return;
        }
        this.#store.markVisited(cid);
        this.#store.addNode({ id: cid, kind: "method", label: declName(decl), source: sourceOf(decl) });
        if (fn.body) {
            this.walk(fn.body, cid);
        }
    }

    #handleIdentifierCall(context: CallContext, callee: ts.Identifier): void {
        const { child, currentId, decl, sym } = context;
        const isLibGlobal = decl !== null && this.#program.isSourceFileDefaultLibrary(decl.getSourceFile());
        const isCollaborator = !isLibGlobal && (decl !== null || isFactoryName(callee.text));
        if (!isCollaborator) {
            this.#bumpUnresolved(sym);
            return;
        }
        this.#collaborator({ cid: mkNodeId(child), currentId, label: callee.text, source: sourceOf(child) });
    }

    #handlePropertyCall(context: CallContext, callee: ts.PropertyAccessExpression): void {
        const { child, currentId, sym } = context;
        const obj = communicationObjName(callee.expression);
        const method = callee.name.text;
        if (obj === null || LIB_OBJECTS.has(obj) || BUILTIN_METHODS.has(method)) {
            this.#bumpUnresolved(sym);
            return;
        }
        this.#collaborator({
            cid: nodeId(`collab:${obj}`),
            currentId,
            edgeLabel: method,
            label: obj,
            source: sourceOf(child),
        });
    }
}
