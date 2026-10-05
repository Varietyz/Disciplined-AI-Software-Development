import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { isType, nameOf, nodeAt } from "../../shared/selectors/syntax.selector.ts";
import type { ClosureGraph } from "../../types/closure.types.ts";
import { INSTANCE_SCOPED_REGISTRARS } from "../../shared/allowlists/registrar.allowlist.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { loadClosureGraph } from "../../shared/loaders/graph.loader.ts";
import { normalizePath } from "../../shared/resolvers/anchor.resolver.ts";
import { suffixAfterVerb } from "../../shared/manifests/verb.manifest.ts";

const REGISTER_VERB = "register";
const STANDARD_PREFIXES = ["get", "list", "has"];

interface Offender {
    files: string[];
    fn: string;
    suffix: string;
}

const registrarFiles = function registrarFiles(closure: ClosureGraph): Map<string, Set<string>> {
    const byFn = new Map<string, Set<string>>();
    for (const r of closure.registers) {
        if (INSTANCE_SCOPED_REGISTRARS.has(r.fn)) {
            continue;
        }
        const files = byFn.get(r.fn) ?? new Set<string>();
        files.add(r.file);
        byFn.set(r.fn, files);
    }
    return byFn;
};

const matchesSuffix = function matchesSuffix(consumerSuffix: string, suffix: string): boolean {
    return consumerSuffix === suffix || consumerSuffix === `${suffix}s` || `${consumerSuffix}s` === suffix;
};

const hasStandardConsumer = function hasStandardConsumer(closure: ClosureGraph, suffix: string): boolean {
    return closure.consumers.some((c) =>
        STANDARD_PREFIXES.some((prefix) => {
            const consumerSuffix = suffixAfterVerb(c.fn, prefix);
            return consumerSuffix !== null && matchesSuffix(consumerSuffix, suffix);
        }),
    );
};

const findNonStandardRegistries = function findNonStandardRegistries(closure: ClosureGraph): Offender[] {
    const offenders: Offender[] = [];
    for (const [fn, files] of registrarFiles(closure)) {
        const suffix = suffixAfterVerb(fn, REGISTER_VERB);
        if (suffix !== null && !hasStandardConsumer(closure, suffix)) {
            offenders.push({ files: [...files], fn, suffix });
        }
    }
    return offenders;
};

const GRAPH = loadClosureGraph();
const OFFENDERS = GRAPH === null ? [] : findNonStandardRegistries(GRAPH);

export default {
    create(context: RuleContext): RuleListener {
        if (GRAPH === null) {
            return listener({
                program(_view, node) {
                    context.report({ messageId: "graphMissing", node });
                },
            });
        }
        if (OFFENDERS.length === 0) {
            return {};
        }
        const filename = normalizePath(context.filename);
        const here = OFFENDERS.filter((off) => off.files.some((f) => filename.endsWith(f)));
        if (here.length === 0) {
            return {};
        }
        return listener({
            functionDeclaration(view, node) {
                const id = nodeAt(view, "id");
                if (!isType(id, "Identifier")) {
                    return;
                }
                const name = nameOf(id);
                for (const off of here.filter((entry) => entry.fn === name)) {
                    context.report({ data: { suffix: off.suffix }, messageId: "nonStandard", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({
                detects: [],
                enforces: ["architecture:intent-revealing-interface", "architecture:registry-pattern"],
            }),
            description:
                "Every registry must expose at least one consumer named to the standard shape — `getX(id)`, `listXs()` or `hasX(id)`. A bespoke selector name defeats every cross-cutting tool that finds registries by that convention, this workspace's own rules included, so the registry becomes invisible to the checks meant to govern it. A bespoke selector is added ALONGSIDE the standard trio, never in place of it. A registrar that attaches to one instance rather than a shared table is classified in the instance-registrar allowlist, which is data the mechanism reads rather than a name written into this rule.",
        },
        messages: {
            graphMissing:
                "The closure graph is missing, so this rule fails closed rather than passing vacuously. Run the gate, whose auto-fix stage rebuilds the graph before linting reads it.",
            nonStandard:
                "Registry `{{ suffix }}` has no standard consumer (get{{ suffix }} / list{{ suffix }}s / has{{ suffix }}). Bespoke verb-suffix consumers defeat audit tooling. Add a standard accessor; the bespoke one can stay alongside.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
