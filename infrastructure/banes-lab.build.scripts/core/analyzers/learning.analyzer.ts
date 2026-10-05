import {
    ROUTE_SECTIONS_POPULATION,
    ROUTE_SECTION_PARTS,
    SITE_PAGES,
} from "#configuration/constants/learning.constants";
import type { TabRecord, TabsFor } from "#types/learning.types";
import { heldIn, sectionsIn, textOf, unitsOf } from "#core/converters/learning.converter";
import type { ContentGraph } from "@banes-lab/web/types/methodology.types.js";
import type { Population } from "#types/catalog.types";

const entriesIn = function entriesIn(tab: TabRecord): number {
    const sections: unknown = tab.sections;
    return Array.isArray(sections) ? sections.length : 0;
};

const tabParts = function tabParts(
    tab: TabRecord,
    graph: ContentGraph | undefined,
    routed: ReadonlySet<string>,
): readonly (readonly [string, number])[] {
    const titled = sectionsIn(tab);
    const untitled: readonly [string, number] = [ROUTE_SECTION_PARTS.untitled, entriesIn(tab) - titled.length];
    if (graph === undefined) {
        return [untitled, [ROUTE_SECTION_PARTS.graphless, titled.length]];
    }
    if (!routed.has(textOf(tab.id))) {
        return [untitled, [ROUTE_SECTION_PARTS.silent, titled.length]];
    }
    const held = heldIn(graph, titled).length;
    return [untitled, [ROUTE_SECTION_PARTS.routed, held], [ROUTE_SECTION_PARTS.unheld, titled.length - held]];
};

export const routeSections = function routeSections(graphs: readonly ContentGraph[], tabsFor: TabsFor): Population {
    const byPage = new Map(graphs.map((graph) => [graph.page, graph]));
    const parts = new Map<string, number>(Object.values(ROUTE_SECTION_PARTS).map((part) => [part, 0]));
    let whole = 0;
    for (const page of SITE_PAGES) {
        const graph = byPage.get(page);
        const tabs = tabsFor(page);
        const routed = new Set(graph === undefined ? [] : unitsOf(page, graph, tabs).map((unit) => unit.tab));
        for (const tab of tabs) {
            whole += entriesIn(tab);
            for (const [part, count] of tabParts(tab, graph, routed)) {
                parts.set(part, (parts.get(part) ?? 0) + count);
            }
        }
    }
    return { name: ROUTE_SECTIONS_POPULATION, parts: Object.fromEntries(parts), whole };
};
