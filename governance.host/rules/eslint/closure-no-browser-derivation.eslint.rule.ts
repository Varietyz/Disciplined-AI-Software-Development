import { DERIVATION_MODULES, relativeFromMember } from "../../shared/manifests/layer.manifest.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { buildImportGraph, findEntrypoints, walkReachable } from "../../shared/analyzers/liveness.analyzer.ts";
import { loadClosureGraph, normalizeImport } from "../../shared/loaders/graph.loader.ts";
import type { ClosureGraph } from "../../types/closure.types.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { deriveBarrelPatterns } from "../../shared/loaders/barrel.loader.ts";
import { listener } from "../../shared/factories/listener.factory.ts";

const ENTRYPOINT_SUFFIX = concernSuffix("entrypoint");

const browserFiles = function browserFiles(closure: ClosureGraph): ReadonlySet<string> {
    const entrypoints = findEntrypoints(closure, [ENTRYPOINT_SUFFIX], deriveBarrelPatterns());
    return walkReachable(entrypoints, buildImportGraph(closure)).reachableFiles;
};

const GRAPH = loadClosureGraph();
const BROWSER = GRAPH === null ? null : browserFiles(GRAPH);

const derivationImportsIn = function derivationImportsIn(closure: ClosureGraph, file: string): readonly string[] {
    return [...closure.imports, ...closure.sideEffectImports].flatMap((imp) => {
        const target = imp.file === file ? normalizeImport(imp.file, imp.from) : null;
        return target !== null && DERIVATION_MODULES.has(target) ? [target] : [];
    });
};

export default {
    create(context: RuleContext): RuleListener {
        const rel = relativeFromMember(context.filename);
        if (GRAPH === null || BROWSER === null) {
            return listener({
                program(_view, node) {
                    context.report({ messageId: "graphMissing", node });
                },
            });
        }
        if (!BROWSER.has(rel) || DERIVATION_MODULES.has(rel)) {
            return {};
        }
        return listener({
            program(_view, node) {
                for (const target of derivationImportsIn(GRAPH, rel)) {
                    context.report({ data: { file: rel, module: target }, messageId: "browserDerivation", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:single-source-of-truth"] }),
            description:
                "A file the browser bundle reaches may not import a module that derives relations. The build derives every relation and writes it into the generated assets a deployment ships, so a derivation in the browser answers the same question a second time. The modules are declared in DERIVATION_MODULES. This rule sees imports only; a derivation written inline in a browser file is not reported.",
        },
        messages: {
            browserDerivation:
                "`{{file}}` is part of the browser bundle and imports `{{module}}`, which derives relations while the page runs. Read the relation from the generated asset instead.",
            graphMissing:
                "The closure graph is missing, so this rule reports a failure instead of passing without reading anything. Run the gate, whose auto-fix stage rebuilds the graph before the lint stage reads it.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
