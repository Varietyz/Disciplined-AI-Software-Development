import {
    GRAPH_FIELD_RULES,
    GRAPH_VOCABULARY,
    PRODUCER_SUFFIX,
    RECORDS_POPULATION,
    SITE_LAYER,
} from "#configuration/constants/graph.constants";
import type { Graph, GraphBuild, GraphContext } from "#types/graph.types";
import {
    ROLLED_UP_RELATIONS,
    TOOLTIP_RELATIONS,
    chunkKeyOf,
    isListingRef,
} from "@banes-lab/web/constants/graph.constants";
import { absolutePath, relativePath } from "@ssot/paths";
import { canonicalOf, sourceFiles, toolsOf } from "#core/converters/source.converter";
import { coverage, layerPopulation, presence, tooltipGaps, uncoveredSections } from "#core/analyzers/graph.analyzer";
import { danglingEdges, mergeGraphs } from "#core/converters/graph.converter";
import { discover, tabsFromDiscovery } from "#core/converters/site.converter";
import { graphLines, missingPopulation } from "#configuration/strings/graph.strings";
import { nodeOf, teachingNodes } from "@banes-lab/content/core/converters/section.converter.ts";
import { sectionNumbers, siteCodes } from "#core/converters/graph.code.converter";
import { writeGraphChunks, writeGraphReport } from "#core/persistence/graph.persistence";
import type { BuiltOntology } from "#types/ontology.types";
import type { Discovery } from "#types/site.types";
import type { ModuleImporter } from "#types/loader.types";
import type { RouteStop } from "#types/learning.types";
import { buildLearningMap } from "#core/coordinators/learning.coordinator";
import { buildTabs } from "#core/persistence/tab.persistence";
import { chunksOf } from "#core/converters/graph.segment.converter";
import { createLinker } from "#core/resolvers/link.resolver";
import { evidenceTargetOf } from "#core/resolvers/evidence.resolver";
import { importFolder } from "#core/loaders/folder.loader";
import { loadContentGraphs } from "@banes-lab/content/core/loaders/coverage.loader.ts";
import { loadFrom } from "#core/loaders/site.loader";
import { loadWebModules } from "#core/loaders/catalog.loader";
import { moduleServer } from "#core/factories/server.factory";
import { ontologyGraph } from "#core/converters/graph.ontology.converter";
import { recordIdentities } from "#core/converters/record.converter";
import { registeredProducers } from "#core/registries/producer.registry";
import { renderSearchAsset } from "#core/formatters/search.formatter";
import { routeEdges } from "#core/converters/graph.link.converter";
import { routeSections } from "#core/analyzers/learning.analyzer";
import { routeStops } from "#core/converters/learning.catalog.converter";
import { searchAssetOf } from "#core/loaders/search.loader";
import { sectionPlans } from "#core/converters/section.converter";
import { writeCanonicalText } from "@govlab/canonical-write";

export const buildGraph = async function buildGraph(
    runner: ModuleImporter,
    discovery: Discovery,
    stops: readonly RouteStop[],
    built: BuiltOntology,
): Promise<GraphBuild> {
    const web = await loadWebModules(runner);
    const tools = toolsOf(web);
    const { collections } = built;
    const trees = web.anatomy.ANATOMY_TREES.map((tree) => ({ ...tree, label: web.source.treeLabelOf(tree.tab) }));
    const plans = sectionPlans(discovery, () => null);
    const records = recordIdentities(collections, web.ontology.hrefOf);
    const identities = [
        ...plans.map((plan) => plan.identity),
        ...records,
        ...sourceFiles(trees, tools).map((file) => file.identity),
    ];
    const linker = createLinker(identities, discovery.site, canonicalOf(discovery.site, tools));
    const vocabulary = GRAPH_VOCABULARY;
    const ontology = ontologyGraph(collections, vocabulary, GRAPH_FIELD_RULES);
    const route = routeEdges(stops);
    const roots = trees.map((tree) => tree.snapshot.tree);
    const context: GraphContext = {
        built,
        codes: siteCodes(discovery.routes, plans, stops),
        discovery,
        evidenceSubjects: [...plans.map((plan) => plan.identity.ref), ...records.map((record) => record.ref)],
        evidenceTarget: evidenceTargetOf(roots, web.definition.definitionIndexOf(roots), web.source),
        ids: {
            ...tools,
            folderHref: web.source.folderHref,
            folderId: web.source.folderId,
            nodeHref: web.source.nodeHref,
        },
        numbers: sectionNumbers(plans, stops),
        ontology,
        route,
        scope: { linker, plans, web },
        trees,
        vocabulary,
    };
    await importFolder("app.graphProducers", PRODUCER_SUFFIX);
    const merged = mergeGraphs(registeredProducers().map((producer) => producer.produce(context)));
    const graph: Graph = {
        edges: merged.edges,
        nodes: merged.nodes.map((node) =>
            node.href === null ? { ...node, href: linker.byRef(node.ref)?.href ?? null } : node,
        ),
    };
    const rules = {
        contains: vocabulary.contains,
        keptRelations: TOOLTIP_RELATIONS,
        keyOf: chunkKeyOf,
        pairs: GRAPH_VOCABULARY.pairs,
        rollsUp: ROLLED_UP_RELATIONS,
        skipsSource: isListingRef,
    };
    const chunks = chunksOf(graph, rules);
    const sections = graph.nodes.filter((node) => node.layer === SITE_LAYER);
    const teaching = new Set(teachingNodes(await loadContentGraphs()));
    return {
        chunks,
        report: {
            ambiguous: ontology.ambiguous,
            dangling: danglingEdges(graph),
            duplicates: merged.duplicates.map(([kept, dropped]) => ({ dropped, kept })),
            fields: ontology.fields,
            graph,
            populations: [
                ...ontology.populations,
                layerPopulation(graph.nodes),
                presence("site numbers", sections, (node) => node.number !== null),
                presence("node links", graph.nodes, (node) => node.href !== null),
                ...coverage(graph),
            ],
            tooltipGaps: tooltipGaps(graph, chunks, rules),
            uncovered: uncoveredSections(plans, teaching, graph, nodeOf),
            undeclared: ontology.undeclared,
            unresolved: [...ontology.unresolved, ...route.unresolved],
        },
    };
};

export const deriveGraph = async function deriveGraph(root: string, ontology: BuiltOntology): Promise<string> {
    const server = await moduleServer(root);
    try {
        const loaded = await loadFrom(server);
        const discovery = discover(loaded);
        const tabs = tabsFromDiscovery(discovery);
        const blocks = await buildLearningMap(loaded.links, tabs);
        const routes = await buildTabs(loaded.links, tabs);
        const stops = routeStops(blocks);
        const built = await buildGraph(loaded.runner, discovery, stops, ontology);
        const { chunks } = built;
        const report = {
            ...built.report,
            populations: [...built.report.populations, routeSections(await loadContentGraphs(), tabs)],
        };
        const search = await searchAssetOf(
            loaded.runner,
            stops.map((stop) => stop.path),
        );
        await writeCanonicalText(absolutePath("app.search"), renderSearchAsset(search));
        const records = report.populations.find((population) => population.name === RECORDS_POPULATION)?.whole;
        if (records === undefined) {
            throw new Error(missingPopulation(RECORDS_POPULATION));
        }
        writeGraphReport(report);
        await writeGraphChunks(chunks);
        return graphLines(
            { chunks: chunks.size, records, report, routes, search, stops: stops.length },
            {
                graph: relativePath("app.graph"),
                learning: relativePath("app.learning"),
                report: relativePath("govlabHost.reports.content.graph"),
                search: relativePath("app.search"),
                tabs: relativePath("app.tabs"),
            },
        );
    } finally {
        await server.close();
    }
};
