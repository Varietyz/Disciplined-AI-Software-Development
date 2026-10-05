import type { BakedTabs } from "@banes-lab/web/types/vocabulary.types.js";
import type { PageTabs } from "#types/tab.types";

export const renderTabs = function renderTabs(pages: readonly PageTabs[]): string {
    return [
        'import type { PageTabs } from "#types/tab.types";',
        "",
        `export const PAGE_TABS: readonly PageTabs[] = JSON.parse(${JSON.stringify(JSON.stringify(pages))});`,
        "",
    ].join("\n");
};

export const renderBakedTabs = function renderBakedTabs(entries: readonly BakedTabs[]): string {
    return [
        'import type { Tab } from "#types/document.types";',
        "",
        ...entries.flatMap((entry) => [
            `export const ${entry.name}: readonly Tab[] = JSON.parse(${JSON.stringify(JSON.stringify(entry.tabs))});`,
            "",
        ]),
    ].join("\n");
};
