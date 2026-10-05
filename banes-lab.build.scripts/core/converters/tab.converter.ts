import type { PageTabs, TabRouter } from "#types/tab.types";
import type { TabsFor } from "#types/learning.types";
import { textOf } from "#core/converters/learning.converter";

export const pageTabsOf = function pageTabsOf(router: TabRouter, page: string, tabsFor: TabsFor): PageTabs {
    const tabs = tabsFor(page)
        .map((tab) => ({ id: textOf(tab.id), label: textOf(tab.label) }))
        .filter((tab) => tab.id.length > 0)
        .map((tab, index) => ({ ...tab, path: index === 0 ? router.pagePath(page) : router.tabLink(page, tab.id) }));
    return { page, tabs };
};
