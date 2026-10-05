import { GOVERNED_ROOT, normalizePath } from "../../shared/resolvers/anchor.resolver.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { loadClosureGraph, normalizeImport } from "../../shared/loaders/graph.loader.ts";
import type { ClosureGraph } from "../../types/closure.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

type FileGraph = Map<string, Set<string>>;

const buildGraph = function buildGraph(closure: ClosureGraph): FileGraph {
    const graph: FileGraph = new Map();
    const addEdge = function addEdge(from: string, importStr: string): void {
        const resolved = normalizeImport(from, importStr);
        if (resolved === null) {
            return;
        }
        const targets = graph.get(from) ?? new Set<string>();
        targets.add(resolved);
        graph.set(from, targets);
    };
    for (const imp of closure.imports) {
        addEdge(imp.file, imp.from);
    }
    for (const imp of closure.sideEffectImports) {
        addEdge(imp.file, imp.from);
    }
    return graph;
};

const WHITE = 0;
const GRAY = 1;
const BLACK = 2;

interface Frame {
    idx: number;
    node: string;
    targets: string[] | null;
}

const cycleThrough = function cycleThrough(parent: Map<string, string>, from: string, target: string): string[] {
    const path = [target];
    let cursor: string | undefined = from;
    while (cursor !== undefined && cursor !== target) {
        path.push(cursor);
        cursor = parent.get(cursor);
    }
    path.push(target);
    return path.reverse();
};

const findCycles = function findCycles(graph: FileGraph): string[][] {
    const color = new Map<string, number>();
    const parent = new Map<string, string>();
    const cycles: string[][] = [];

    const visit = function visit(start: string): void {
        const stack: Frame[] = [{ idx: 0, node: start, targets: null }];
        color.set(start, GRAY);
        const step = function step(frame: Frame): void {
            frame.targets ??= [...(graph.get(frame.node) ?? [])];
            const target = frame.targets[frame.idx];
            if (target === undefined) {
                color.set(frame.node, BLACK);
                stack.pop();
                return;
            }
            frame.idx += 1;
            const seen = color.get(target) ?? WHITE;
            if (seen === GRAY) {
                cycles.push(cycleThrough(parent, frame.node, target));
                return;
            }
            if (seen === WHITE) {
                parent.set(target, frame.node);
                color.set(target, GRAY);
                stack.push({ idx: 0, node: target, targets: null });
            }
        };
        while (stack.length > 0) {
            const frame = stack.at(-1);
            if (frame === undefined) {
                break;
            }
            step(frame);
        }
    };

    for (const node of graph.keys()) {
        if ((color.get(node) ?? WHITE) === WHITE) {
            visit(node);
        }
    }
    return cycles;
};

const GRAPH = loadClosureGraph();
const CYCLES = GRAPH === null ? [] : findCycles(buildGraph(GRAPH));

const FILES_IN_CYCLES = ((): Map<string, string[]> => {
    const byFile = new Map<string, string[]>();
    for (const cycle of CYCLES) {
        const repr = cycle.join(" → ");
        for (const file of cycle) {
            const chains = byFile.get(file) ?? [];
            chains.push(repr);
            byFile.set(file, chains);
        }
    }
    return byFile;
})();

const MEMBER_PREFIX = `${normalizePath(GOVERNED_ROOT)}/`;

const relFromMember = function relFromMember(filepath: string): string {
    const norm = normalizePath(filepath);
    const idx = norm.indexOf(MEMBER_PREFIX);
    return idx === -1 ? norm : norm.slice(idx + MEMBER_PREFIX.length);
};

export default {
    create(context: RuleContext): RuleListener {
        const rel = relFromMember(context.filename);
        return listener({
            program(_view, node) {
                if (GRAPH === null) {
                    context.report({ messageId: "graphMissing", node });
                    return;
                }
                for (const chain of FILES_IN_CYCLES.get(rel) ?? []) {
                    context.report({ data: { chain }, messageId: "cycle", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({
                detects: ["architecture:circular-dependency"],
                enforces: ["architecture:directed-acyclic-graph"],
            }),
            description:
                "Detects circular imports in the codebase. A file A that imports (directly or transitively) a file B that imports A creates a cycle — modules cannot be loaded deterministically, tree-shaking breaks, and the dependency direction is muddled. Cycles indicate misplaced shared concerns; lift the cycled state into a third file both can import.",
        },
        messages: {
            cycle: "File participates in an import cycle: `{{ chain }}`. Lift the shared concern into a third file both ends can import without circling back.",
            graphMissing:
                "closure-graph missing. Run `npm run verify` to regenerate. Fail-close until the graph is available.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
