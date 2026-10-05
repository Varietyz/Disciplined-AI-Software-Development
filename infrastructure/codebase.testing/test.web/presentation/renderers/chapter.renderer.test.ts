import {
    PAIRED_SECTION_CLASS,
    PANEL_COLUMN_CLASS,
    PANEL_COLUMN_LIMIT,
    PANEL_FOOTER_CLASS,
    PANEL_FOOTER_COLUMNS_PROPERTY,
    PANEL_KINDS,
} from "@banes-lab/web/configuration/constants/chapter.constants.ts";
import type { Section, Tab } from "@banes-lab/web/types/document.types.ts";
import { describe, expect, it } from "vitest";
import { renderChapter, renderChapterSection } from "@banes-lab/web/presentation/renderers/chapter.renderer.ts";
import { sectionLabel, subsectionId } from "@banes-lab/web/presentation/renderers/section.renderer.ts";
import { declaredStyle } from "@banes-lab/web/core/registries/style.registry.ts";

const PROSE_ONLY: Section = {
    icon: "",
    id: "prose-only",
    intro: "An intro.",
    subsections: [{ blocks: [{ kind: "text", text: "A paragraph." }], content: "Lead.", title: "First" }],
    title: "Prose only",
};

const PAIRED: Section = {
    icon: "",
    id: "paired",
    subsections: [
        {
            blocks: [
                { kind: "text", text: "Prose." },
                { code: "const a = 1;", kind: "code", language: "javascript", title: "A sample" },
            ],
            title: "With a panel",
        },
    ],
    title: "Paired",
};

const TAB: Tab = { icon: "", id: "chapter", label: "The chapter", sections: [PROSE_ONLY, PAIRED] };

describe("renderChapter", () => {
    const article = renderChapter(TAB);
    const sections = [...article.querySelectorAll("section.chapter-section")];

    it("titles the chapter with the tab label and gives every section its id", () => {
        expect(article.querySelector("h1.chapter-title")?.textContent).toBe(TAB.label);
        expect(sections.map((section) => section.id)).toStrictEqual([PROSE_ONLY.id, PAIRED.id]);
    });

    it("renders a section with no panel as prose alone, spanning the row", () => {
        const [prose] = sections;
        expect(prose?.classList.contains("chapter-section-paired")).toBe(false);
        expect(prose?.querySelector(".chapter-panels")).toBeNull();
        expect(prose?.querySelector("p.chapter-lead")?.textContent).toBe(PROSE_ONLY.intro);
        expect(prose?.querySelector(`#${subsectionId(PROSE_ONLY.id, 0)}`)).not.toBeNull();
    });

    it("moves every panel kind into the panel column and leaves the prose in the prose column", () => {
        const [, paired] = sections;
        expect(paired?.classList.contains("chapter-section-paired")).toBe(true);
        expect(paired?.querySelectorAll(".chapter-panels .chapter-panel")).toHaveLength(1);
        expect(paired?.querySelector(".chapter-prose .code-block")).toBeNull();
        expect(paired?.querySelector(".chapter-prose .block-text")).not.toBeNull();
        expect(PANEL_KINDS.has("code")).toBe(true);
        expect(PANEL_KINDS.has("mermaid")).toBe(true);
        expect(PANEL_KINDS.has("text")).toBe(false);
    });

    it("keeps the first panels in the side column and moves the rest into a footer grid below", () => {
        const panels = Array.from({ length: PANEL_COLUMN_LIMIT + 2 }, (_, index) => ({
            code: `const n = ${String(index)};`,
            kind: "code" as const,
            language: "javascript",
            title: `Sample ${String(index)}`,
        }));
        const section = renderChapterSection({ ...PAIRED, subsections: [{ blocks: panels, title: "Many" }] }, 1);
        expect(section.classList.contains(PAIRED_SECTION_CLASS)).toBe(true);
        expect(section.querySelectorAll(`.${PANEL_COLUMN_CLASS} > .chapter-panel`)).toHaveLength(PANEL_COLUMN_LIMIT);
        expect(section.querySelectorAll(`.${PANEL_FOOTER_CLASS} > .chapter-panel`)).toHaveLength(2);
        const footer = section.querySelector<HTMLElement>(`.${PANEL_FOOTER_CLASS}`);
        expect(section.lastElementChild).toBe(footer);
        expect(declaredStyle(footer ?? section, PANEL_FOOTER_COLUMNS_PROPERTY)).toBe("2");
        expect(renderChapterSection(PAIRED, 1).querySelector(`.${PANEL_FOOTER_CLASS}`)).toBeNull();
    });

    it("renders one section on its own, labeled by the index it is given", () => {
        const section = renderChapterSection(PAIRED, 3);
        expect(section.id).toBe(PAIRED.id);
        expect(section.classList.contains(PAIRED_SECTION_CLASS)).toBe(true);
        expect(section.querySelector(".chapter-label")?.textContent).toBe(sectionLabel(3));
    });
});
