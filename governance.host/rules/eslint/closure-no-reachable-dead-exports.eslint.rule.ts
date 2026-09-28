import type { ClosureGraph, ExportEntry } from "../../types/closure.types.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { exportedNamesOf, locOf } from "../../shared/selectors/syntax.selector.ts";
import { STAGED_FUTURE_ALLOWLIST } from "../../shared/allowlists/export.allowlist.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { loadClosureGraph } from "../../shared/loaders/graph.loader.ts";
import { normalizePath } from "../../shared/resolvers/anchor.resolver.ts";

const ALLOWED_KEYS = new Set(STAGED_FUTURE_ALLOWLIST.map((entry) => entry.file));

const isAllowed = function isAllowed(key: string): boolean {
    if (ALLOWED_KEYS.has(key)) {
        return true;
    }
    const sep = key.indexOf("::");
    return sep > 0 && ALLOWED_KEYS.has(key.slice(0, sep));
};

const importedNames = function importedNames(closure: ClosureGraph): Set<string> {
    const names = new Set<string>();
    for (const imp of [...closure.imports, ...closure.externalConsumers]) {
        for (const name of imp.names) {
            names.add(name);
        }
    }
    return names;
};

const computeDeadExports = function computeDeadExports(closure: ClosureGraph): ExportEntry[] {
    const imported = importedNames(closure);
    return closure.exports.filter((e) => !imported.has(e.name) && !isAllowed(`${e.file}::${e.name}`));
};

const GRAPH = loadClosureGraph();

const DEAD_BY_FILE = ((): Map<string, Set<string>> => {
    const byFile = new Map<string, Set<string>>();
    if (GRAPH === null) {
        return byFile;
    }
    for (const e of computeDeadExports(GRAPH)) {
        const names = byFile.get(e.file) ?? new Set<string>();
        names.add(e.name);
        byFile.set(e.file, names);
    }
    return byFile;
})();

export default {
    create(context: RuleContext): RuleListener {
        if (GRAPH === null) {
            return listener({
                program(_view, node) {
                    context.report({ messageId: "graphMissing", node });
                },
            });
        }
        const filename = normalizePath(context.filename);
        const matchKey = [...DEAD_BY_FILE.keys()].find((f) => filename.endsWith(f));
        if (matchKey === undefined) {
            return {};
        }
        const deadNames = DEAD_BY_FILE.get(matchKey) ?? new Set<string>();
        return listener({
            exportNamedDeclaration(view) {
                for (const e of exportedNamesOf(view).filter((entry) => deadNames.has(entry.name))) {
                    const payload = { key: `${matchKey}::${e.name}`, name: e.name };
                    context.report({ data: payload, loc: locOf(e.target), messageId: "unimported" });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: ["architecture:zombie-code"], enforces: [] }),
            description:
                "Single-hop dead-export check: every named export is imported by name somewhere in the member, in a centralized test, or in a build config. It is cheaper than the transitive-liveness pass and complements it, catching the simple cases a single hop is sufficient for. The staged-future allowlist marks intentional exceptions, and each entry is a claim about a verified construct rather than a way to quiet the check.",
        },
        messages: {
            graphMissing:
                "The closure graph is missing, so this rule fails closed rather than passing vacuously. Run the gate, whose auto-fix stage rebuilds the graph before linting reads it.",
            unimported:
                "Export `{{ name }}` is never imported by name anywhere. Drop the `export` keyword if it is internal-only, or delete the declaration if it is dead.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
