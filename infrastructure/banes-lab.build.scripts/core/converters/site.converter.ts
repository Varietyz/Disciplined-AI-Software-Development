import type { DiscoveredPage, DiscoveredRoute, Discovery } from "#types/site.types";
import type { PageDefinition, SiteSource } from "#types/page.types";
import type { TabsFor } from "#types/learning.types";
import { definitionOf } from "#core/selectors/page.selector";
import { tabsIn as tabRecordsIn } from "@banes-lab/content/core/selectors/payload.selector.ts";
import { textualize } from "#core/converters/payload.converter";

interface NamedTab {
    readonly id: string;
    readonly label: string;
}

const hasString = function hasString(value: object, key: string): boolean {
    return key in value && typeof Reflect.get(value, key) === "string";
};

const isTab = function isTab(value: unknown): value is NamedTab {
    return typeof value === "object" && value !== null && hasString(value, "id") && hasString(value, "label");
};

const tabsIn = function tabsIn(content: unknown): readonly NamedTab[] {
    return tabRecordsIn(content).flatMap((tab) => (isTab(tab) ? [tab] : []));
};

const secondaryTabs = function secondaryTabs(content: unknown): readonly NamedTab[] {
    return tabsIn(content).slice(1);
};

const hasSections = function hasSections(value: unknown): value is { readonly sections: readonly unknown[] } {
    return typeof value === "object" && value !== null && "sections" in value && Array.isArray(value.sections);
};

const idsIn = function idsIn(holder: unknown): readonly string[] {
    if (!hasSections(holder)) {
        return [];
    }
    return holder.sections.flatMap((section) =>
        typeof section === "object" && section !== null && hasString(section, "id")
            ? [String(Reflect.get(section, "id"))]
            : [],
    );
};

const sectionIdsOf = function sectionIdsOf(content: unknown, tab: string | null): readonly string[] {
    if (tabRecordsIn(content).length === 0) {
        return idsIn(content);
    }
    const tabs = tabsIn(content);
    return idsIn(tab === null ? tabs[0] : tabs.find((entry) => entry.id === tab));
};

const tabRoutes = function tabRoutes(loaded: SiteSource, definition: PageDefinition): DiscoveredRoute[] {
    return secondaryTabs(definition.content).map((tab) => {
        const path = loaded.links.tabLink(definition.id, tab.id);
        return {
            ...loaded.renderer.headOf(definition.id, definition, path),
            label: tab.label,
            markdown: loaded.exportText(path, definition.id, sectionIdsOf(definition.content, tab.id)),
            page: definition.id,
            tab: tab.id,
        };
    });
};

export const tabsFromDiscovery = function tabsFromDiscovery(discovery: Discovery): TabsFor {
    return (page) => tabRecordsIn(discovery.pages.find((entry) => entry.id === page)?.content ?? null);
};

export const discover = function discover(loaded: SiteSource): Discovery {
    const pages: DiscoveredPage[] = loaded.ids.map((page) => {
        const definition = definitionOf(loaded, page);
        const head = loaded.renderer.headOf(page, definition);
        return {
            ...head,
            content: textualize(definition.content, loaded.inline),
            id: page,
            label: definition.title,
            markdown: loaded.exportText(head.path, page, sectionIdsOf(definition.content, null)),
            page,
            tab: null,
        };
    });
    const routes = pages.flatMap((page) => [page, ...tabRoutes(loaded, definitionOf(loaded, page.id))]);
    return {
        author: loaded.author,
        consent: loaded.consent,
        name: loaded.name,
        pages,
        routes,
        site: loaded.links.SITE_URL,
        summary: loaded.summary,
    };
};
