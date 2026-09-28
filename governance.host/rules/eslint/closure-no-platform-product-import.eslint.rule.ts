import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { classifyFile, relativeFromMember, resolveImportPath } from "../../shared/manifests/layer.manifest.ts";
import type { ClosureGraph } from "../../types/closure.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { loadClosureGraph } from "../../shared/loaders/graph.loader.ts";

const GRAPH = loadClosureGraph();

const productImportsIn = function productImportsIn(
    closure: ClosureGraph,
    sourceFile: string,
): { from: string; resolved: string }[] {
    const violations: { from: string; resolved: string }[] = [];
    for (const imp of closure.imports) {
        if (relativeFromMember(imp.file) !== sourceFile) {
            continue;
        }
        const resolved = resolveImportPath(imp.file, imp.from);
        if (resolved !== null && classifyFile(resolved) === "product") {
            violations.push({ from: imp.from, resolved });
        }
    }
    return violations;
};

export default {
    create(context: RuleContext): RuleListener {
        const rel = relativeFromMember(context.filename);
        if (classifyFile(rel) !== "platform") {
            return {};
        }
        return listener({
            program(_view, node) {
                if (GRAPH === null) {
                    context.report({ messageId: "graphMissing", node });
                    return;
                }
                for (const v of productImportsIn(GRAPH, rel)) {
                    const payload = { from: v.from, resolved: v.resolved };
                    context.report({ data: payload, messageId: "platformImportsProduct", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({
                detects: ["architecture:boundary-leakage"],
                enforces: ["architecture:dependency-inversion"],
            }),
            description:
                "A file classified platform may not import one classified product. The platform tier is application-agnostic by definition, so a product dependency inverts the direction and makes the platform unreusable in the next application. The classification is declared in the layer manifest, not inferred from a path here.",
        },
        messages: {
            graphMissing:
                "closure-graph missing. Run `npm run verify` to regenerate. Fail-close until the graph is available.",
            platformImportsProduct:
                "Platform file imports the product tier: `{{from}}` resolves to `{{resolved}}`, which is classified product. Three resolutions, in order of preference: move the imported file into the platform tier if it is genuinely generic; invert the flow so the platform emits and the product subscribes; or inject the dependency behind an interface the platform declares.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
