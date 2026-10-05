import { barrelPath, pruneStaleBarrels, writeCatalogJson } from "#core/persistence/catalog.persistence";
import { catalogNodes, catalogPayload, concernGroups } from "#core/converters/catalog.converter";
import type { CatalogContext } from "#types/environment.types";
import { buildDocGraph } from "#core/analyzers/graph.analyzer";
import { catalogSummary } from "#configuration/strings/catalog.strings";
import { healMarkdown } from "#core/persistence/document.persistence";
import { print } from "#core/reporters/base.reporter";
import { renderConcernBarrel } from "#core/formatters/catalog.formatter";

export const runCatalog = async function runCatalog(context: CatalogContext, indexDir: string): Promise<void> {
    const graph = buildDocGraph(catalogNodes(context));
    const superseded = new Set(graph.superseded);
    const jsonHealed = await writeCatalogJson(indexDir, catalogPayload(graph, superseded));
    const groups = concernGroups(graph);
    const barrelContext = { rootPrefix: context.rootPrefix, superseded };
    const barrelsHealed = [...groups].filter(([concern, nodes]) =>
        healMarkdown(barrelPath(indexDir, concern), renderConcernBarrel(concern, nodes, barrelContext)),
    ).length;
    const pruned = pruneStaleBarrels(indexDir, new Set(groups.keys()));
    print(
        catalogSummary({
            concerns: groups.size,
            cycles: graph.cycles.length,
            deadEdges: graph.deadEdges.length,
            docs: graph.nodes.length,
            healed: (jsonHealed ? 1 : 0) + barrelsHealed,
            pruned,
            superseded: graph.superseded.length,
        }),
    );
};
