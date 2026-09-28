import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { MEMBER_ROOT, isSourceFile, normalizePath } from "../../shared/resolvers/anchor.resolver.ts";
import { loadClosureGraph, normalizeImport } from "../../shared/loaders/graph.loader.ts";
import type { ClosureGraph } from "../../types/closure.types.ts";
import { STAGED_FUTURE_ALLOWLIST } from "../../shared/allowlists/export.allowlist.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const ENTRYPOINT_SUFFIX = concernSuffix("entrypoint");

const buildGraph = function buildGraph(closure: ClosureGraph): Map<string, string[]> {
    const graph = new Map<string, string[]>();
    const add = function add(file: string, from: string): void {
        const target = normalizeImport(file, from);
        if (target === null) {
            return;
        }
        const targets = graph.get(file) ?? [];
        targets.push(target);
        graph.set(file, targets);
    };
    for (const imp of closure.imports) {
        add(imp.file, imp.from);
    }
    for (const imp of closure.sideEffectImports) {
        add(imp.file, imp.from);
    }
    return graph;
};

const seedsOf = function seedsOf(closure: ClosureGraph): string[] {
    const files = new Set<string>();
    for (const e of closure.exports) {
        files.add(e.file);
    }
    for (const i of closure.imports) {
        files.add(i.file);
    }
    for (const i of closure.sideEffectImports) {
        files.add(i.file);
    }
    const seeds = [...files].filter((f) => f.endsWith(ENTRYPOINT_SUFFIX));
    for (const imp of closure.externalConsumers) {
        const target = normalizeImport(imp.file, imp.from);
        if (target !== null) {
            seeds.push(target);
        }
    }
    return seeds;
};

const computeReachable = function computeReachable(closure: ClosureGraph): Set<string> {
    const graph = buildGraph(closure);
    const stack = seedsOf(closure);
    const reachable = new Set<string>();
    while (stack.length > 0) {
        const file = stack.pop();
        if (file === undefined || reachable.has(file)) {
            continue;
        }
        reachable.add(file);
        stack.push(...(graph.get(file) ?? []));
    }
    return reachable;
};

const GRAPH = loadClosureGraph();
const REACHABLE = GRAPH === null ? null : computeReachable(GRAPH);
const EXCLUDED = new Set(STAGED_FUTURE_ALLOWLIST.map((entry) => entry.file));

const MEMBER_PREFIX = ((): string => {
    const norm = normalizePath(MEMBER_ROOT);
    return norm.endsWith("/") ? norm.slice(0, -1) : norm;
})();

const toRelative = function toRelative(filename: string): string {
    const norm = normalizePath(filename);
    return norm.startsWith(MEMBER_PREFIX) ? norm.slice(MEMBER_PREFIX.length + 1) : norm;
};

const isInsideMember = function isInsideMember(filename: string): boolean {
    return normalizePath(filename).startsWith(`${MEMBER_PREFIX}/`);
};

export default {
    create(context: RuleContext): RuleListener {
        const { filename } = context;
        if (!isInsideMember(filename) || !isSourceFile(filename)) {
            return {};
        }
        const rel = toRelative(filename);
        if (EXCLUDED.has(rel) || rel.endsWith(".d.ts")) {
            return {};
        }
        if (REACHABLE === null) {
            return listener({
                program(_view, node) {
                    context.report({ messageId: "graphMissing", node });
                },
            });
        }
        if (REACHABLE.has(rel)) {
            return {};
        }
        return listener({
            program(_view, node) {
                context.report({ data: { file: rel }, messageId: "unreachable", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: ["architecture:zombie-code"], enforces: [] }),
            description:
                "Every file in the governed member must be reachable from a declared entrypoint, a centralized test, a build config, or a glob barrel. The export-level liveness rules run per export and are silenced by the staged-future allowlist, so a file whose every export is allowlisted disappears from their view entirely — an unwired subsystem then passes the gate. This rule asserts the file itself is connected. The allowlist may exempt a file, but `closure-allowlist-entries-are-wired` holds every entry to the same bar: a whole-file entry nothing imports is reported as unwired, so the list cannot quietly accumulate.",
        },
        messages: {
            graphMissing:
                "The closure graph is missing, so this rule fails closed rather than passing vacuously. Run the gate, whose auto-fix stage rebuilds the graph before linting reads it.",
            unreachable:
                "File `{{ file }}` is not reachable from any entrypoint, centralized test, build config, or glob barrel. Nothing imports it, directly or transitively. Wire it to a consumer or delete it — an unreachable file is not staged capability, it is code that cannot run.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
