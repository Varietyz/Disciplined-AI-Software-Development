import { describe, expect, it } from "vitest";
import { ONTOLOGY_PRINCIPLES_TAB } from "@banes-lab/web/core/ids/ontology.ids.ts";
import { ONTOLOGY_TABS } from "@banes-lab/web/configuration/strings/ontology.fragment.strings.ts";
import { SEARCH_ATTRIBUTE } from "@banes-lab/web/configuration/constants/ontology.constants.ts";
import { STATIC_RENDER_ATTRIBUTE } from "@banes-lab/web/configuration/constants/document.constants.ts";
import type { Tab } from "@banes-lab/web/types/document.types.ts";
import { renderExplorer } from "@banes-lab/web/presentation/renderers/ontology.renderer.ts";

const principlesTab = function principlesTab(): Tab {
    const principles = ONTOLOGY_TABS.find((tab) => tab.id === ONTOLOGY_PRINCIPLES_TAB);
    if (principles === undefined) {
        throw new Error("no principles tab");
    }
    return principles;
};

const DIAGRAM = principlesTab().sections[0]?.blocks?.find((block) => block.kind === "mermaid");
const LONG_VALUE = "A rule that runs on well past the width one card can hold without stacking. ".repeat(3);

const FIXTURE: Tab = {
    icon: "",
    id: "fixture",
    label: "Fixture",
    sections: [
        {
            blocks: DIAGRAM === undefined ? [] : [DIAGRAM],
            icon: "",
            id: "group-one",
            intro: "One.",
            subsections: [
                {
                    blocks: [
                        { items: ["Kind: principle", "Severity: mandatory"], kind: "list" },
                        {
                            entries: [
                                { description: "High Cohesion", term: "Requires" },
                                { description: LONG_VALUE, term: "Rule" },
                            ],
                            kind: "glossary",
                        },
                    ],
                    id: "architecture-alpha",
                    title: "Alpha",
                },
                {
                    blocks: [
                        {
                            entries: [
                                { description: "First.", term: "one" },
                                { description: "Second.", term: "two" },
                            ],
                            kind: "glossary",
                        },
                    ],
                    title: "Entries",
                },
            ],
            title: "Group one",
        },
    ],
};

describe("renderExplorer", () => {
    const article = renderExplorer(FIXTURE);

    it("renders a search box, a category navigator and one record per subsection or catalog entry", () => {
        expect(article.querySelector(".filter-box")).not.toBeNull();
        expect(article.querySelectorAll(".explorer-nav-list a")).toHaveLength(1);
        expect(article.querySelectorAll(".record")).toHaveLength(3);
        expect(article.querySelector("#architecture-alpha .record-chip")?.textContent).toBe("Kind: principle");
        expect(article.querySelector("#architecture-alpha")?.getAttribute(SEARCH_ATTRIBUTE)).toContain("high cohesion");
        expect(article.querySelector(".explorer-count")?.textContent).toBe("3 of 3 shown");
    });

    it("renders a record's body only once its details open, as field cards, widening a card whose value runs long", () => {
        const details = article.querySelector("#architecture-alpha details");
        expect(article.querySelectorAll("#architecture-alpha .record-field")).toHaveLength(0);
        details?.dispatchEvent(new Event("toggle"));
        const cards = article.querySelectorAll("#architecture-alpha .record-field");
        expect(cards).toHaveLength(2);
        expect(cards[0]?.classList.contains("record-field-wide")).toBe(false);
        expect(cards[1]?.classList.contains("record-field-wide")).toBe(true);
        details?.dispatchEvent(new Event("toggle"));
        expect(article.querySelectorAll("#architecture-alpha .record-field")).toHaveLength(2);
    });

    it("keeps the diagram in a panel behind a collapsed summary, rendered on first open", () => {
        const details = article.querySelector(".explorer-group > .record-details");
        expect(details?.hasAttribute("open")).toBe(false);
        expect(details?.querySelector(".chapter-panel")).toBeNull();
        details?.dispatchEvent(new Event("toggle"));
        expect(details?.querySelector(".chapter-panel .diagram-figure")).not.toBeNull();
    });

    it("renders every body eagerly for a static render", () => {
        document.documentElement.setAttribute(STATIC_RENDER_ATTRIBUTE, "");
        const rendered = renderExplorer(FIXTURE);
        document.documentElement.removeAttribute(STATIC_RENDER_ATTRIBUTE);
        expect(rendered.querySelectorAll("#architecture-alpha .record-field")).toHaveLength(2);
        expect(rendered.querySelector(".explorer-group > .record-details .chapter-panel")).not.toBeNull();
    });

    it("filters records and groups by the typed query", () => {
        const search = article.querySelector<HTMLInputElement>(".filter-box");
        if (search === null) {
            throw new Error("no search box");
        }
        search.value = "second";
        search.dispatchEvent(new Event("input"));
        const records = [...article.querySelectorAll<HTMLElement>(".record")];
        expect(records.filter((record) => record.hidden === false).map((record) => record.id)).toStrictEqual([
            "group-one-sub-1-sub-1",
        ]);
        expect(article.querySelector(".explorer-count")?.textContent).toBe("1 of 3 shown");
        search.value = "";
        search.dispatchEvent(new Event("input"));
        expect(records.every((record) => record.hidden === false)).toBe(true);
    });

    it("renders the real principles tab with one record per principle", () => {
        const principles = principlesTab();
        const rendered = renderExplorer(principles);
        const expected = principles.sections.reduce((total, section) => total + section.subsections.length, 0);
        expect(rendered.querySelectorAll(".record")).toHaveLength(expected);
    });
});
