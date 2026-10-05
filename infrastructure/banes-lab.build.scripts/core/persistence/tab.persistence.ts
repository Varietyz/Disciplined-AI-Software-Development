import { SITE_PAGES } from "#configuration/constants/learning.constants";
import type { TabRouter } from "#types/tab.types";
import type { TabsFor } from "#types/learning.types";
import { absolutePath } from "@ssot/paths";
import { pageTabsOf } from "#core/converters/tab.converter";
import { renderTabs } from "#core/formatters/tab.formatter";
import { writeCanonicalText } from "@govlab/canonical-write";

export const buildTabs = async function buildTabs(
    router: TabRouter,
    tabsFor: TabsFor,
    file = absolutePath("app.tabs"),
): Promise<number> {
    const pages = SITE_PAGES.map((page) => pageTabsOf(router, page, tabsFor));
    await writeCanonicalText(file, renderTabs(pages));
    return pages.reduce((total, page) => total + page.tabs.length, 0);
};
