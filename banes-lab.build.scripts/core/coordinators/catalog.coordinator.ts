import {
    CHAPTER_PREFIX,
    CHECK_RELATIONS,
    GRAPH_VOCABULARY,
    ONTOLOGY_LAYER,
} from "#configuration/constants/graph.constants";
import type { Catalog, Link, Placement, Relation } from "#types/catalog.types";
import { EVIDENCE_RELATION_ID, LINKS_TO_RELATION, reverseOf } from "@banes-lab/web/constants/graph.constants";
import { FILE_SEARCH, RECORD_SEARCH, SECTION_SEARCH } from "#configuration/constants/catalog.constants";
import { NUMBERS_TITLE, ROUTE_TITLE } from "#configuration/strings/catalog.strings";
import { aliasPhrasesOf, vocabularyOf } from "#core/converters/vocabulary.converter";
import { canonicalOf, sourceFiles, sourceLeaves, toolsOf } from "#core/converters/source.converter";
import { closureLeaves, recordIdentities, recordLeaves, relationNamesOf } from "#core/converters/record.converter";
import { contactLeaf, contactOf } from "#core/converters/company.converter";
import { definitionPhrases, identityPhrases, resolveLeaves, resolveTable } from "#core/converters/identifier.converter";
import { edgeIndexOf, groundingSources, inboundRelations, outboundRelations } from "#core/converters/graph.converter";
import { facetGroups, kindFacetGroups } from "#core/converters/filter.converter";
import {
    fileEntries,
    queryLeaf,
    recordEntries,
    searchRulesOf,
    searchSections,
    sectionEntries,
} from "#core/converters/search.converter";
import {
    navigationOf,
    numberRows,
    numbersLeaves,
    routeLeaf,
    routeStops,
} from "#core/converters/learning.catalog.converter";
import { sectionLeaves, sectionPlans } from "#core/converters/section.converter";
import type { BuiltOntology } from "#types/ontology.types";
import type { Discovery } from "#types/site.types";
import type { FolderRelations } from "#types/source.types";
import type { ModuleImporter } from "#types/loader.types";
import type { ReferenceRelation } from "@banes-lab/web/types/reference.types.js";
import type { SectionExporter } from "#types/section.types";
import { closeCatalog } from "#core/coordinators/catalog.index.coordinator";
import { createLinker } from "#core/resolvers/link.resolver";
import { createStore } from "#core/stores/catalog.store";
import { folderRelations } from "#core/converters/folder.converter";
import { guardPages } from "#core/guards/catalog.guard";
import { indexPlansOf } from "#core/converters/index.converter";
import { loadContentGraphs } from "@banes-lab/content/core/loaders/coverage.loader.ts";
import { loadWebModules } from "#core/loaders/catalog.loader";
import { nodeLinks } from "#core/converters/link.converter";
import { numbersIn } from "#core/converters/graph.code.converter";
import { placementsOf } from "#core/converters/location.converter";
import { readGraphReport } from "#core/loaders/graph.loader";
import { readJournal } from "#core/persistence/journal.persistence";
import { renderDataLeaf } from "#core/formatters/data.formatter";
import { searchLeaves } from "#core/converters/search.index.converter";
import { sourceTextOf } from "#core/loaders/source.loader";

export const buildCatalog = async function buildCatalog(
    runner: ModuleImporter,
    discovery: Discovery,
    bodies: SectionExporter,
    ontology: BuiltOntology,
): Promise<Catalog> {
    guardPages(discovery);
    const web = await loadWebModules(runner);
    const { site } = discovery;
    const { collections, context } = ontology;
    const tools = toolsOf(web);
    const summarize = (markdown: string): string | null =>
        web.markup.summarizeMarkup(web.reference.plainMarkdown(markdown), "") || null;
    const plans = sectionPlans(discovery, summarize);
    const records = recordIdentities(collections, web.ontology.hrefOf);
    const trees = web.anatomy.ANATOMY_TREES.map((tree) => ({ ...tree, label: web.source.treeLabelOf(tree.tab) }));
    const files = sourceFiles(trees, tools);
    const identities = [...plans.map((plan) => plan.identity), ...records, ...files.map((file) => file.identity)];
    const routes = new Set(discovery.routes.map((route) => route.path));
    const linker = createLinker(identities, site, canonicalOf(site, tools), routes);
    const store = createStore(site, renderDataLeaf);
    const stops = routeStops(web.learning.LEARNING);
    const groups = [...facetGroups(context), ...kindFacetGroups(collections)];
    const indexes = indexPlansOf({
        collections,
        discovery,
        files,
        groups,
        localPath: web.folder.localPath,
        plans,
        site,
    });
    const placements = placementsOf(
        [...indexes.tabs, ...indexes.pages, ...indexes.collections, ...indexes.folders, ...indexes.trees],
        identities,
        site,
    );
    const placement = (ref: string): Placement | null => placements.get(ref) ?? null;
    const folders = folderRelations(trees, { fileId: web.source.fileId, folderHref: web.source.folderHref }, linker);
    const folder = (ref: string): FolderRelations | null => folders.get(ref) ?? null;
    const { graph, report } = readGraphReport();
    const edges = edgeIndexOf(graph);
    const ontologyRefs = new Set(graph.nodes.filter((node) => node.layer === ONTOLOGY_LAYER).map((node) => node.ref));
    const ontologyEdges = graph.edges.filter((edge) => ontologyRefs.has(edge.from) && ontologyRefs.has(edge.to));
    const nodes = new Map(graph.nodes.map((node) => [node.ref, node]));
    const evidence = (ref: string): readonly Link[] =>
        nodeLinks(linker, nodes, edges.outgoing(ref, EVIDENCE_RELATION_ID));
    const linkedBy = (ref: string): readonly Link[] =>
        edges.incoming(ref, LINKS_TO_RELATION).map((edge) => linker.link(edge.label, edge.ref));
    const links = (ref: string): readonly Link[] =>
        edges.outgoing(ref, LINKS_TO_RELATION).map((edge) => linker.link(edge.label, edge.ref));
    const sourcesOf = groundingSources(graph, edges, (ref) => linker.byRef(ref)?.href ?? null);
    const groundsOf = (ref: string): readonly Link[] =>
        sourcesOf(ref).map((source) => linker.link(source.label, source.ref));
    store.add(
        sectionLeaves(plans, {
            bodies,
            evidence: (href) => evidence(CHAPTER_PREFIX + href),
            folder,
            graphs: await loadContentGraphs(),
            grounds: groundsOf,
            linkedBy,
            linker,
            links,
            navigation: navigationOf(stops, linker),
            numbers: numbersIn(report),
            placement,
        }),
    );
    const checkEdges = graph.edges.filter(
        (edge) => ontologyRefs.has(edge.from) && !ontologyRefs.has(edge.to) && CHECK_RELATIONS.has(edge.relation),
    );
    const inbound = inboundRelations({ edges: ontologyEdges, nodes: graph.nodes }, GRAPH_VOCABULARY.pairs);
    const outbound = outboundRelations({ edges: [...ontologyEdges, ...checkEdges], nodes: graph.nodes });
    const recordInbound = (ref: string): readonly ReferenceRelation[] => [
        ...(outbound.get(ref) ?? []),
        ...(inbound.get(ref) ?? []),
    ];
    store.add(recordLeaves(collections, { context, evidence, inbound: recordInbound, linkedBy, linker, placement }));
    store.add(closureLeaves(context, linker));
    const grounds = async (ref: string): Promise<readonly Link[]> => groundsOf(ref);
    const checks = (ref: string): readonly Relation[] =>
        [...CHECK_RELATIONS].map((relation) => ({
            links: edges.incoming(ref, relation).map((edge) => linker.link(edge.label, edge.ref)),
            relation: reverseOf(relation) ?? relation,
        }));
    store.add(
        await sourceLeaves(files, {
            checks,
            folder,
            grounds,
            linkedBy,
            linker,
            placement,
            textOf: sourceTextOf,
            tools,
        }),
    );
    const aliases = aliasPhrasesOf(context);
    const phrases = [...vocabularyOf(context), ...aliases, ...identityPhrases(identities), ...definitionPhrases(files)];
    const words = (text: string): readonly string[] => web.matcher.markupWords(text);
    const searched = [
        { entries: sectionEntries(await searchSections(web), linker), kind: SECTION_SEARCH },
        { entries: recordEntries(records, aliases, words), kind: RECORD_SEARCH },
        { entries: fileEntries(files, words), kind: FILE_SEARCH },
    ];
    const queries = store.add([
        routeLeaf(stops, linker, ROUTE_TITLE),
        ...numbersLeaves(numberRows(graph, discovery.routes, linker), site, NUMBERS_TITLE),
        ...searchLeaves(searched, searchRulesOf(web), linker),
        queryLeaf(site, [
            ...GRAPH_VOCABULARY.pairs.flatMap((pair) => [pair.forward, pair.reverse]),
            ...relationNamesOf(collections, recordInbound),
        ]),
        ...resolveLeaves(resolveTable(phrases), linker),
        contactLeaf(contactOf(web), site),
    ]);
    const journal = closeCatalog(store, { discovery, indexes, journal: readJournal(), queries });
    return { files: store.files, journal, unresolved: linker.unresolved() };
};
