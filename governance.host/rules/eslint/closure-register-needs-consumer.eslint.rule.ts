import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { isType, nameOf, nodeAt } from "../../shared/selectors/syntax.selector.ts";
import type { ClosureGraph } from "../../types/closure.types.ts";
import { INSTANCE_SCOPED_REGISTRARS } from "../../shared/allowlists/registrar.allowlist.ts";
import { defineCheck } from "@govlab/context/check";
import { isUpperAlpha } from "@govlab/constants";
import { listener } from "../../shared/factories/listener.factory.ts";
import { loadClosureGraph } from "../../shared/loaders/graph.loader.ts";
import { suffixAfterVerb } from "../../shared/manifests/verb.manifest.ts";

const REGISTER_VERB = "register";
const CONSUMER_VERBS = ["get", "list", "has", "emit", "dispatch"];

const registrarSuffixes = function registrarSuffixes(closure: ClosureGraph): Map<string, number> {
    const counts = new Map<string, number>();
    for (const r of closure.registers) {
        if (INSTANCE_SCOPED_REGISTRARS.has(r.fn)) {
            continue;
        }
        const suffix = suffixAfterVerb(r.fn, REGISTER_VERB);
        if (suffix !== null) {
            counts.set(suffix, (counts.get(suffix) ?? 0) + 1);
        }
    }
    return counts;
};

const consumerSuffixes = function consumerSuffixes(closure: ClosureGraph): Set<string> {
    const suffixes = new Set<string>();
    for (const c of closure.consumers) {
        for (const verb of CONSUMER_VERBS) {
            const suffix = suffixAfterVerb(c.fn, verb);
            if (suffix === null) {
                continue;
            }
            suffixes.add(suffix);
            if (suffix.endsWith("es")) {
                suffixes.add(suffix.slice(0, -2));
            }
            if (suffix.endsWith("s")) {
                suffixes.add(suffix.slice(0, -1));
            }
        }
    }
    return suffixes;
};

const coversSuffix = function coversSuffix(consumed: ReadonlySet<string>, suffix: string): boolean {
    const lowered = suffix.charAt(0).toLowerCase() + suffix.slice(1);
    if (consumed.has(suffix) || consumed.has(lowered)) {
        return true;
    }
    for (const candidate of consumed) {
        if (candidate.length === 0 || candidate.length >= suffix.length) {
            continue;
        }
        if (suffix.startsWith(candidate) && isUpperAlpha(suffix.charAt(candidate.length))) {
            return true;
        }
    }
    return false;
};

const findOrphanRegistries = function findOrphanRegistries(closure: ClosureGraph): Map<string, number> {
    const consumed = consumerSuffixes(closure);
    const orphans = new Map<string, number>();
    for (const [suffix, count] of registrarSuffixes(closure)) {
        if (!coversSuffix(consumed, suffix)) {
            orphans.set(suffix, count);
        }
    }
    return orphans;
};

const GRAPH = loadClosureGraph();
const ORPHANS = GRAPH === null ? new Map<string, number>() : findOrphanRegistries(GRAPH);

export default {
    create(context: RuleContext): RuleListener {
        if (GRAPH === null) {
            return listener({
                program(_view, node) {
                    context.report({ messageId: "graphMissing", node });
                },
            });
        }
        if (ORPHANS.size === 0) {
            return {};
        }
        return listener({
            callExpression(view, node) {
                const callee = nodeAt(view, "callee");
                if (!isType(callee, "Identifier")) {
                    return;
                }
                const suffix = suffixAfterVerb(nameOf(callee), REGISTER_VERB);
                const count = suffix === null ? undefined : ORPHANS.get(suffix);
                if (suffix === null || count === undefined) {
                    return;
                }
                const payload = { count: String(count), suffix };
                context.report({ data: payload, messageId: "orphanRegistry", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: ["architecture:zombie-code"], enforces: ["architecture:registry-pattern"] }),
            description:
                "Every dispatch-table registry (anything declared via `registerX(...)`) MUST have at least one consumer site (`getX(...)`, `listXs()`, `hasX(...)`). Write-only registries are dead infrastructure — consumers bypass them via direct import OR the registry serves zero purpose. Either delete the registry's consumer API, OR migrate every consumer to dispatch via `getX(id)`.",
        },
        messages: {
            graphMissing:
                "The closure graph is missing, so this rule fails closed rather than passing vacuously. Run the gate, whose auto-fix stage rebuilds the graph before linting reads it.",
            orphanRegistry:
                "Registry `{{ suffix }}` is write-only: {{ count }} register{{ suffix }}() call(s), 0 get{{ suffix }}/list{{ suffix }}s/has{{ suffix }} consumer sites. Either DELETE the consumer API and treat as a roster, OR migrate every consumer to dispatch via the registry. Cannot have both halves living simultaneously.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
