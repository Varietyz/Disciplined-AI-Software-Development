import { LAYER_SUBJECT, basenameOf, projectFiles } from "../../shared/resolvers/anchor.resolver.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import {
    STRING_LAYERS,
    TYPE_LAYERS,
    classifyFile,
    relativeFromMember,
    resolveImportPath,
} from "../../shared/manifests/layer.manifest.ts";
import type { ClosureGraph } from "../../types/closure.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { loadClosureGraph } from "../../shared/loaders/graph.loader.ts";
import { resolveFile } from "../../shared/matchers/filename.matcher.ts";

const MANIFEST_BASENAME = basenameOf(resolveFile(LAYER_SUBJECT, "manifest", projectFiles()));

const GRAPH = loadClosureGraph();

const deriveLayer = function deriveLayer(closure: ClosureGraph, targetFile: string): string {
    const importerLayers = new Set(
        closure.imports
            .filter((imp) => resolveImportPath(imp.file, imp.from) === targetFile)
            .map((imp) => classifyFile(imp.file)),
    );
    if (importerLayers.has("platform")) {
        return "platform";
    }
    return importerLayers.has("product") ? "product" : "unused";
};

const collectDrift = function collectDrift(closure: ClosureGraph): string[] {
    const declared = new Map<string, string>([...TYPE_LAYERS.entries(), ...STRING_LAYERS.entries()]);
    const drift: string[] = [];
    for (const [path, layer] of declared) {
        if (layer === "platform" && deriveLayer(closure, path) === "product") {
            drift.push(path);
        }
    }
    return drift;
};

const DRIFT = GRAPH === null ? [] : collectDrift(GRAPH);

export default {
    create(context: RuleContext): RuleListener {
        if (!relativeFromMember(context.filename).endsWith(MANIFEST_BASENAME)) {
            return {};
        }
        return listener({
            program(_view, node) {
                if (GRAPH === null) {
                    context.report({ messageId: "graphMissing", node });
                    return;
                }
                for (const path of DRIFT) {
                    context.report({ data: { path }, messageId: "platformOverclaim", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:layered-architecture"] }),
            description:
                "A TYPE_LAYERS or STRING_LAYERS entry must match what the import graph actually shows. A file declared `platform` that only product code imports is overclaiming: the platform declaration is the stricter constraint, since it asserts the file is usable by the reusable tier, while `product` merely says the application tier uses it. This rule surfaces a declaration broader than the usage justifying it, which is how a tier boundary quietly stops meaning anything.",
        },
        messages: {
            graphMissing:
                "closure-graph missing. Run `npm run verify` to regenerate. Fail-close until the graph is available.",
            platformOverclaim:
                "File `{{ path }}` is declared `platform` in the layer manifest, but the import graph shows only product code consuming it. Either reclassify it as `product` to match reality, or wire a platform consumer that justifies the broader claim.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
