import { prerenderLine, sourcePagesLine } from "#configuration/strings/page.strings";
import { SOURCE_SITEMAP_ROUTE } from "#configuration/constants/site.constants";
import { defineStep } from "#core/factories/step.factory";
import { ontologyOf } from "#core/guards/site.guard";
import { prerenderSite } from "#core/coordinators/page.coordinator";

const PRERENDER = "prerender";

defineStep({
    cache: null,
    modes: ["build"],
    name: PRERENDER,
    needs: ["ontology", "graph", "icons", "diagrams"],
    phase: "close",
    async run(state) {
        const { catalog, routes, sources } = await prerenderSite(
            state.root,
            state.outDir,
            ontologyOf(state, PRERENDER),
        );
        return { gives: {}, line: prerenderLine(routes, catalog) + sourcePagesLine(sources, SOURCE_SITEMAP_ROUTE) };
    },
});
