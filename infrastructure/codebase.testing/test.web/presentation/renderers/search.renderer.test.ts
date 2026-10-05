import { describe, expect, it } from "vitest";
import type { SearchSource } from "@banes-lab/web/types/search.types.ts";
import type { Section } from "@banes-lab/web/types/document.types.ts";
import { exportText } from "@banes-lab/web/core/converters/text.converter.ts";
import { renderSpread } from "@banes-lab/web/presentation/renderers/search.renderer.ts";

const SECTION: Section = {
    icon: "bi-x",
    id: "the-gate",
    subsections: [{ content: "The gate holds the line.", title: "The check is the rule" }],
    title: "The gate",
};

const CHAPTER: SearchSource = {
    first: false,
    icon: "bi-cpu",
    label: "Methodology — Build",
    layout: "chapter",
    page: "disciplined-methodology",
    tab: { icon: "bi-cpu", id: "build", label: "Build", sections: [] },
    tone: "methodology",
};

describe("renderSpread", () => {
    it("renders a chapter hit with the chapter renderer inside its home page's tone", () => {
        const spread = renderSpread({
            home: "/disciplined-methodology/build#the-gate",
            sections: [SECTION],
            source: CHAPTER,
        });
        expect(spread.classList.contains("methodology")).toBe(true);
        expect(spread.querySelector("section.chapter-section#the-gate")).not.toBeNull();
        const home = spread.querySelector<HTMLAnchorElement>(".tab-anchor .tab-bar a.tab-button");
        expect(home?.getAttribute("href")).toBe("/disciplined-methodology/build#the-gate");
        expect(home?.textContent).toBe(CHAPTER.label);
    });

    it("keeps the page and tab label in the copied text, so two groups with one tab name stay apart", () => {
        const spread = renderSpread({
            home: "/disciplined-methodology/build#the-gate",
            sections: [SECTION],
            source: CHAPTER,
        });
        expect(exportText(spread)).toContain(CHAPTER.label);
    });

    it("renders a document hit in the chapter section shape and no tone", () => {
        const spread = renderSpread({
            home: "/terms#the-gate",
            sections: [SECTION],
            source: { ...CHAPTER, layout: "document", page: "terms", tone: null },
        });
        expect(spread.className).toBe("tab-page");
        expect(spread.querySelector("article.document section.chapter-section#the-gate")).not.toBeNull();
    });
});
