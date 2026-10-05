import { GRAMMAR_META, METHODOLOGY_META } from "@banes-lab/web/configuration/strings/tab.strings.ts";
import { afterEach, describe, expect, it } from "vitest";
import {
    layoutOf,
    renderContent,
    renderFooterFor,
    renderTabContent,
    renderTabFooter,
    renderTabHeader,
    renderTabs,
} from "@banes-lab/web/presentation/renderers/tab.renderer.ts";
import { ACTIVE_CLASS } from "@banes-lab/web/configuration/constants/element.constants.ts";
import { TREE_TAB } from "@banes-lab/web/core/ids/anatomy.ids.ts";
import { loadTreeTab } from "@banes-lab/web/core/loaders/tree.loader.ts";
import { ARCHITECTURE_TABS } from "@banes-lab/web/core/generated/architecture.page.generated.ts";
import { GRAMMAR_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { GRAMMAR_TABS } from "@banes-lab/web/core/generated/grammar.page.generated.ts";
import { METHODOLOGY_TABS } from "@banes-lab/web/core/generated/methodology.page.generated.ts";
import { ONTOLOGY_TABS } from "@banes-lab/web/configuration/strings/ontology.fragment.strings.ts";

const EMBLEM_CLASS = "tab-page-emblem";
const BUTTON_CLASS = "tab-button";
const SECTION_CLASS = "tab-section";

const [firstTab] = GRAMMAR_TABS;
const subsectionCount = function subsectionCount(): number {
    return (firstTab?.sections ?? []).reduce((total, section) => total + section.subsections.length, 0);
};

afterEach(() => {
    document.body.replaceChildren();
});

describe("renderTabHeader", () => {
    it("shows the title, subtitle and an emblem when the meta carries one", () => {
        const header = renderTabHeader(GRAMMAR_META);
        expect(header.textContent.includes(GRAMMAR_META.title)).toBe(true);
        expect(header.textContent.includes(GRAMMAR_META.subtitle)).toBe(true);
        expect(header.querySelector(`.${EMBLEM_CLASS}`)).not.toBeNull();
        expect(renderTabHeader(METHODOLOGY_META).querySelector(`.${EMBLEM_CLASS}`)).toBeNull();
    });
});

describe("renderTabs", () => {
    it("renders one button per tab and marks the active one", () => {
        const bar = renderTabs(GRAMMAR_PAGE, GRAMMAR_TABS, firstTab?.id ?? "");
        const buttons = bar.querySelectorAll(`.${BUTTON_CLASS}`);
        expect(buttons).toHaveLength(GRAMMAR_TABS.length);
        expect(buttons[0]?.classList.contains(ACTIVE_CLASS)).toBe(true);
    });
});

describe("renderTabContent", () => {
    it("renders every section of the tab", () => {
        const content = renderTabContent(firstTab?.sections ?? []);
        expect(content.querySelectorAll(`.${SECTION_CLASS}`)).toHaveLength(firstTab?.sections.length ?? 0);
    });
});

describe("renderContent", () => {
    it("renders a chapter for the chapter layout and sections for the grid layout", () => {
        const [methodologyTab] = METHODOLOGY_TABS;
        if (firstTab === undefined || methodologyTab === undefined) {
            throw new Error(GRAMMAR_PAGE);
        }
        expect(renderContent("chapter", methodologyTab).classList.contains("chapter-content")).toBe(true);
        expect(renderContent("grid", firstTab).querySelectorAll(`.${SECTION_CLASS}`)).toHaveLength(
            firstTab.sections.length,
        );
    });

    it("lets a tab override the page layout, and drops the section footer for a glossary", () => {
        const glossary = ARCHITECTURE_TABS.find((tab) => tab.layout === "glossary");
        if (glossary === undefined || firstTab === undefined) {
            throw new Error(GRAMMAR_PAGE);
        }
        expect(layoutOf("chapter", glossary)).toBe("glossary");
        expect(renderContent("chapter", glossary).classList.contains("glossary-content")).toBe(true);
        expect(renderFooterFor("chapter", glossary)?.querySelector(".tab-symbol")?.textContent).toBe("A");
        expect(renderFooterFor("grid", firstTab)?.querySelector(".tab-symbol")?.textContent).toBe("A1");
    });

    it("renders the explorer for an ontology tab, with category jumps only in the footer", () => {
        const explorer = ONTOLOGY_TABS.find((tab) => tab.layout === "ontology");
        if (explorer === undefined) {
            throw new Error(GRAMMAR_PAGE);
        }
        expect(renderContent("grid", explorer).classList.contains("explorer-content")).toBe(true);
        expect(renderFooterFor("grid", explorer)?.querySelectorAll(`.${BUTTON_CLASS}`)).toHaveLength(
            explorer.sections.length,
        );
    });

    it("renders the filesystem for a tree tab and drops the footer", async () => {
        const tree = await loadTreeTab(TREE_TAB);
        if (tree === undefined) {
            throw new Error(GRAMMAR_PAGE);
        }
        expect(renderContent("chapter", tree).classList.contains("filesystem-content")).toBe(true);
        expect(renderFooterFor("chapter", tree)).toBeNull();
    });
});

describe("renderTabFooter", () => {
    it("renders one jump button per section and one per subsection", () => {
        const sections = firstTab?.sections ?? [];
        const footer = renderTabFooter(sections);
        expect(footer.querySelectorAll(`.${BUTTON_CLASS}`)).toHaveLength(sections.length + subsectionCount());
        expect(footer.querySelector(".tab-symbol")?.textContent).toBe("A1");
    });
});
