import { GO_ENTRY, GO_STDLIB_NOISE } from "#configuration/constants/code.go.constants";
import type { GoCall, GoFunc, GoGraphContext, GoIndex } from "#types/code.types";
import { callsIn, parseFuncs } from "#core/parsers/code.go.parser";
import { GraphStore } from "#core/stores/graph.store";
import { lineAt } from "#core/lexers/code.go.lexer";
import { nodeId } from "#core/normalizers/diagram.normalizer";
import { readFileSync } from "node:fs";
import { sanitizeGo } from "#core/sanitizers/code.go.sanitizer";

const MIN_QUALIFIER_LEN = 2;

const funcId = function funcId(fn: GoFunc): string {
    return nodeId(`go:${fn.file}:${fn.name}`);
};

const labelOf = function labelOf(fn: GoFunc): string {
    return fn.receiver === null ? fn.name : `${fn.receiver}.${fn.name}`;
};

class GoGraphBuilder {
    readonly #context: GoGraphContext;

    public constructor(context: GoGraphContext) {
        this.#context = context;
    }

    public seed(fn: GoFunc): void {
        const id = funcId(fn);
        const { store } = this.#context;
        if (store.hasVisited(id)) {
            return;
        }
        store.markVisited(id);
        store.addNode({ id, kind: "entry", label: labelOf(fn), source: this.#sourceOf(fn) });
        this.#walk(fn);
    }

    #sourceOf(fn: GoFunc): { file: string; line: number } {
        return { file: this.#context.relPath(fn.file), line: fn.line };
    }

    #walk(fn: GoFunc): void {
        const sanitized = this.#context.fileSrc.get(fn.file) ?? "";
        for (const call of callsIn(sanitized, fn.bodyStart, fn.bodyEnd)) {
            this.#handleCall(fn, call);
        }
    }

    #handleCall(fn: GoFunc, call: GoCall): void {
        if (call.qualifier !== null) {
            this.#collaborator(fn, call, call.qualifier);
            return;
        }
        const target = this.#context.funcMap.get(call.name);
        if (target) {
            this.#internalCall(fn, target);
        }
    }

    #collaborator(fn: GoFunc, call: GoCall, qualifier: string): void {
        if (GO_STDLIB_NOISE.has(qualifier) || qualifier.length < MIN_QUALIFIER_LEN) {
            return;
        }
        const cid = nodeId(`go:collab:${qualifier}`);
        this.#context.store.addNode({ id: cid, kind: "collaborator", label: qualifier, source: this.#sourceOf(fn) });
        this.#context.store.pushEdge({ from: funcId(fn), kind: "call", label: call.name, to: cid });
    }

    #internalCall(fn: GoFunc, target: GoFunc): void {
        const { store } = this.#context;
        const tid = funcId(target);
        store.pushEdge({ from: funcId(fn), kind: "call", to: tid });
        if (store.hasVisited(tid)) {
            store.pushEdge({ from: funcId(fn), kind: "loop", to: tid });
            return;
        }
        store.markVisited(tid);
        store.addNode({ id: tid, kind: "method", label: target.name, source: this.#sourceOf(target) });
        this.#walk(target);
    }
}

export const indexGoFiles = function indexGoFiles(files: readonly string[]): GoIndex {
    const fileSrc = new Map<string, string>();
    const funcMap = new Map<string, GoFunc>();
    for (const file of files) {
        const sanitized = sanitizeGo(readFileSync(file, "utf8"));
        fileSrc.set(file, sanitized);
        for (const fn of parseFuncs(sanitized)) {
            if (!funcMap.has(fn.name)) {
                funcMap.set(fn.name, { ...fn, file, line: lineAt(sanitized, fn.sigPos) });
            }
        }
    }
    return { fileSrc, funcMap };
};

const isUpperStart = function isUpperStart(name: string): boolean {
    const first = name.charAt(0);
    return first >= "A" && first <= "Z";
};

const seedFuncs = function seedFuncs(funcMap: ReadonlyMap<string, GoFunc>): GoFunc[] {
    return [...funcMap.values()]
        .filter((fn) => fn.name === GO_ENTRY || isUpperStart(fn.name))
        .toSorted((left, right) => left.name.localeCompare(right.name));
};

export const buildGoGraph = function buildGoGraph(index: GoIndex, relPath: (file: string) => string): GraphStore {
    const store = new GraphStore();
    const builder = new GoGraphBuilder({ ...index, relPath, store });
    for (const fn of seedFuncs(index.funcMap)) {
        builder.seed(fn);
    }
    return store;
};
