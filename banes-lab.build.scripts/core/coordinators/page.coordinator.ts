import { CATALOG_SITEMAP_ROUTE, JSON_ROUTE, MARKDOWN_EXTENSION } from "#configuration/constants/site.constants";
import type { Loaded, Prerendered, SourceBodyRenderer } from "#types/page.types";
import {
    writeDiscovery,
    writePages,
    writeSitemapIndex,
    writeSitemapParts,
    writeSourcePages,
} from "#core/persistence/page.persistence";
import { ANATOMY_PAGE } from "@banes-lab/web/ids/page.ids";
import { ANATOMY_TREE_DECLARATIONS } from "@banes-lab/web/registries/anatomy.tree.registry";
import type { BuiltOntology } from "#types/ontology.types";
import { RUNNER_MODULES } from "#configuration/constants/loader.constants";
import type { SourceRoute } from "#types/source.types";
import { buildCatalog } from "#core/coordinators/catalog.coordinator";
import { closureReport } from "#core/resolvers/catalog.resolver";
import { dirname } from "node:path";
import { discover } from "#core/converters/site.converter";
import { loadFrom } from "#core/loaders/site.loader";
import { loadWebModules } from "#core/loaders/catalog.loader";
import { mkdirSync } from "node:fs";
import { moduleServer } from "#core/factories/server.factory";
import { persistJournal } from "#core/persistence/journal.persistence";
import { sourceRoutes } from "#core/converters/source.route.converter";
import { writeCatalog } from "#core/persistence/catalog.persistence";
import { writeVerbatim } from "@govlab/canonical-write";

const JSON_INDENT = 4;

const sourceRoutesOf = async function sourceRoutesOf(loaded: Loaded): Promise<readonly SourceRoute[]> {
    const web = await loadWebModules(loaded.runner);
    const licenses = new Map(ANATOMY_TREE_DECLARATIONS.map((declaration) => [declaration.tab, declaration.license]));
    const trees = web.anatomy.ANATOMY_TREES.map((tree) => ({ ...tree, label: web.source.treeLabelOf(tree.tab) }));
    return sourceRoutes(trees, {
        languageOf: web.source.languageOf,
        license: (tab) => licenses.get(tab) ?? null,
        localPath: web.folder.localPath,
        nodeRoute: web.source.nodeRoute,
        sourceTitle: web.source.sourceTitle,
        tabPath: (tab) => loaded.links.tabLink(ANATOMY_PAGE, tab),
    });
};

export const prerenderSite = async function prerenderSite(
    root: string,
    outDir: string,
    ontology: BuiltOntology,
): Promise<Prerendered> {
    const server = await moduleServer(root);
    try {
        const loaded = await loadFrom(server);
        const discovery = discover(loaded);
        writePages(outDir, loaded, discovery);
        const pageSitemap = await writeDiscovery(outDir, discovery);
        const { files, journal, unresolved } = await buildCatalog(
            loaded.runner,
            discovery,
            loaded.exportSections,
            ontology,
        );
        const catalog = writeCatalog(outDir, files);
        await persistJournal(journal);
        mkdirSync(dirname(closureReport()), { recursive: true });
        writeVerbatim(closureReport(), JSON.stringify(unresolved, null, JSON_INDENT));
        const leaves = [...files.keys()].filter(
            (address) => !address.startsWith(JSON_ROUTE) && address.endsWith(MARKDOWN_EXTENSION),
        );
        const catalogSitemaps = writeSitemapParts(
            outDir,
            CATALOG_SITEMAP_ROUTE,
            leaves.toSorted((left, right) => left.localeCompare(right)).map((address) => discovery.site + address),
        );
        const sources = await sourceRoutesOf(loaded);
        const body = await loaded.runner.import<SourceBodyRenderer>(RUNNER_MODULES.sourceBody.path);
        const sourceSitemaps = writeSourcePages(
            outDir,
            { body, main: loaded.main, renderer: loaded.renderer, site: discovery.site },
            sources,
        );
        writeSitemapIndex(outDir, discovery.site, [
            pageSitemap,
            ...[...catalogSitemaps, ...sourceSitemaps].map((route): readonly [string, null] => [route, null]),
        ]);
        return { catalog, routes: discovery.routes.length, sources: sources.length };
    } finally {
        await server.close();
    }
};
