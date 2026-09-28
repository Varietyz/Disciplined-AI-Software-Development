import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { exportedNamesOf, locOf } from "../../shared/selectors/syntax.selector.ts";
import type { ExportEntry } from "../../types/closure.types.ts";
import { STAGED_FUTURE_ALLOWLIST } from "../../shared/allowlists/export.allowlist.ts";
import { computeDeadExports } from "../../shared/analyzers/liveness.analyzer.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { deriveBarrelPatterns } from "../../shared/loaders/barrel.loader.ts";
import { listener } from "../../shared/factories/listener.factory.ts";
import { loadClosureGraph } from "../../shared/loaders/graph.loader.ts";

const ENTRYPOINT_GLOB_SUFFIXES = [concernSuffix("entrypoint")];

const ALLOWED_KEYS = new Set(STAGED_FUTURE_ALLOWLIST.map((entry) => entry.file));

const isAllowed = function isAllowed(key: string): boolean {
    if (ALLOWED_KEYS.has(key)) {
        return true;
    }
    const sep = key.indexOf("::");
    return sep > 0 && ALLOWED_KEYS.has(key.slice(0, sep));
};

const GRAPH = loadClosureGraph();
const DEAD =
    GRAPH === null ? null : computeDeadExports(GRAPH, ENTRYPOINT_GLOB_SUFFIXES, deriveBarrelPatterns(), isAllowed);

const buildDeadSetByFile = function buildDeadSetByFile(dead: readonly ExportEntry[]): Map<string, Set<string>> {
    const byFile = new Map<string, Set<string>>();
    for (const e of dead) {
        const names = byFile.get(e.file) ?? new Set<string>();
        names.add(e.name);
        byFile.set(e.file, names);
    }
    return byFile;
};

const DEAD_BY_FILE = DEAD === null ? new Map<string, Set<string>>() : buildDeadSetByFile(DEAD);

export default {
    create(context: RuleContext): RuleListener {
        if (GRAPH === null) {
            return listener({
                program(_view, node) {
                    context.report({ messageId: "graphMissing", node });
                },
            });
        }
        const filename = context.filename.split("\\").join("/");
        const matchKey = [...DEAD_BY_FILE.keys()].find((f) => filename.endsWith(f));
        if (matchKey === undefined) {
            return {};
        }
        const deadNames = DEAD_BY_FILE.get(matchKey) ?? new Set<string>();
        return listener({
            exportNamedDeclaration(view) {
                for (const e of exportedNamesOf(view).filter((entry) => deadNames.has(entry.name))) {
                    const payload = { key: `${matchKey}::${e.name}`, name: e.name };
                    context.report({ data: payload, loc: locOf(e.target), messageId: "deadExport" });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: ["architecture:zombie-code"], enforces: [] }),
            description:
                "Every named export must be transitively reachable from a declared entrypoint, from a centralized test, or from a build config. This walks the import graph and flags exports with no live consumer, including the two-hop dead chain a single-hop check misses. The staged-future allowlist covers finished capability that nothing composes yet.",
        },
        messages: {
            deadExport:
                'Export `{{ name }}` is not transitively reachable from any entrypoint. Wire a consumer, or delete it. If it is finished capability awaiting a consumer, add `{ file: "{{ key }}", reason: "…" }` to STAGED_FUTURE_ALLOWLIST in the export allowlist under the governance host.',
            graphMissing:
                "The closure graph is missing. Run the gate, whose auto-fix stage rebuilds the graph before linting reads it.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
