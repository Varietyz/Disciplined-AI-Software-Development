import { SECTION_LETTERS, SUBSECTION_INFIX } from "@banes-lab/web/configuration/constants/tab.constants.ts";
import { describe, expect, it } from "vitest";
import {
    renderTabSection,
    sectionLabel,
    subsectionId,
    subsectionLabel,
} from "@banes-lab/web/presentation/renderers/section.renderer.ts";
import { START_SECTIONS } from "@banes-lab/web/configuration/strings/methodology.start.strings.ts";
import type { Section } from "@banes-lab/web/types/document.types.ts";

const SECTION = "setup";
const SUBSECTION_CLASS = "tab-subsection";
const CALLOUT_CLASS = "callout";
const GRID_CLASS = "tab-section-grid";
const EMPTY: Section = { icon: "", id: SECTION, subsections: [], title: SECTION };
const CALLOUT: Section = {
    icon: "",
    id: SECTION,
    intro: "A callout.",
    layout: "callout",
    subsections: [{ content: "One.", title: "First" }],
    title: SECTION,
};

const sectionAt = function sectionAt(index: number): Section {
    return START_SECTIONS[index] ?? EMPTY;
};

describe("subsectionId", () => {
    it("joins the section id and index with the infix", () => {
        expect(subsectionId(SECTION, 2)).toBe(`${SECTION}${SUBSECTION_INFIX}2`);
    });
});

describe("sectionLabel and subsectionLabel", () => {
    it("letters a section per tab and numbers its subsections in groups of nine beneath it", () => {
        expect(sectionLabel(0)).toBe("A1");
        expect(sectionLabel(1)).toBe("B1");
        expect(sectionLabel(SECTION_LETTERS.length)).toBe("AA1");
        expect(sectionLabel(SECTION_LETTERS.length + 1)).toBe("AB1");
        expect(sectionLabel(SECTION_LETTERS.length * 2)).toBe("BA1");
        expect(subsectionLabel(1, 0)).toBe("B1.1");
        expect(subsectionLabel(0, 2)).toBe("A1.3");
        expect(subsectionLabel(0, 8)).toBe("A1.9");
        expect(subsectionLabel(0, 9)).toBe("A2.1");
        expect(subsectionLabel(0, 19)).toBe("A3.2");
    });
});

describe("renderTabSection", () => {
    it("renders every subsection with an addressable id and its label", () => {
        const section = sectionAt(0);
        const element = renderTabSection(section, 1);
        expect(element.id).toBe(section.id);
        expect(element.querySelectorAll(`.${SUBSECTION_CLASS}`)).toHaveLength(section.subsections.length);
        expect(element.querySelector(`#${subsectionId(section.id, 0)}`)).not.toBeNull();
        expect(element.querySelector(".section-title .subsection-symbol")?.textContent).toBe("B1");
        expect(element.querySelector(".subsection-title .subsection-symbol")?.textContent).toBe("B1.1");
    });

    it("applies the callout layout and always flows subsections through the grid", () => {
        expect(renderTabSection(CALLOUT, 0).classList.contains(CALLOUT_CLASS)).toBe(true);
        expect(renderTabSection(CALLOUT, 0).querySelector(`.${GRID_CLASS}`)).not.toBeNull();
        expect(renderTabSection(sectionAt(0), 0).classList.contains(CALLOUT_CLASS)).toBe(false);
        expect(renderTabSection(sectionAt(0), 0).querySelector(`.${GRID_CLASS}`)).not.toBeNull();
    });
});
