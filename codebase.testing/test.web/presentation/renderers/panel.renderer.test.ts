import {
    CITE_ATTRIBUTE,
    CITE_CLASS,
    MARK_CLASS,
    TAG_CLASS,
} from "@banes-lab/web/configuration/constants/chapter.constants.ts";
import { describe, expect, it } from "vitest";
import { renderChapterPanel, resolveCitations } from "@banes-lab/web/presentation/renderers/panel.renderer.ts";
import type { Block } from "@banes-lab/web/types/block.types.ts";
import { fillMarkup } from "@banes-lab/web/presentation/renderers/text.renderer.ts";

const SECTION = "getting-started";
const LABEL = "A1";
const CODE: Block = { code: "READ a", kind: "code", language: "pag", title: "node shape" };
const DIAGRAM: Block = { caption: "the loop", kind: "mermaid", text: "flowchart LR\n a --> b" };

describe("renderChapterPanel", () => {
    it("gives the panel an id from the section and its letter, and prefixes the title with the mark", () => {
        const first = renderChapterPanel(CODE, SECTION, LABEL, 0);
        const second = renderChapterPanel(DIAGRAM, SECTION, LABEL, 1);
        expect(first.id).toBe(`${SECTION}-panel-a`);
        expect(first.mark).toBe(`${LABEL}·a`);
        expect(first.tag).toBe("node shape");
        expect(first.element.id).toBe(first.id);
        expect(first.element.querySelector(`.code-title.${TAG_CLASS} .${MARK_CLASS}`)?.textContent).toBe(first.mark);
        expect(second.mark).toBe(`${LABEL}·b`);
        expect(second.tag).toBe("the loop");
        expect(second.element.querySelector(`.diagram-caption .${MARK_CLASS}`)?.textContent).toBe(second.mark);
    });

    it("letters past the alphabet with a second letter", () => {
        expect(renderChapterPanel(CODE, SECTION, LABEL, 26).mark).toBe(`${LABEL}·aa`);
        expect(renderChapterPanel(CODE, SECTION, LABEL, 27).mark).toBe(`${LABEL}·ab`);
    });
});

describe("resolveCitations", () => {
    it("turns a cite placeholder into a link to the panel with the mark, and leaves an unknown cite as text", () => {
        const prose = fillMarkup(
            document.createElement("div"),
            "See <cite>node shape</cite> and <cite>missing</cite>.",
        );
        const panels = [renderChapterPanel(CODE, SECTION, LABEL, 0)];
        expect(prose.querySelectorAll(`span.${CITE_CLASS}[${CITE_ATTRIBUTE}]`)).toHaveLength(2);
        resolveCitations(prose, panels);
        const link = prose.querySelector<HTMLAnchorElement>(`a.${CITE_CLASS}`);
        expect(link?.getAttribute("href")).toBe(`#${SECTION}-panel-a`);
        expect(link?.querySelector(`.${MARK_CLASS}`)?.textContent).toBe(`${LABEL}·a`);
        expect(link?.textContent).toBe(`${LABEL}·anode shape`);
        expect(prose.querySelector(`span.${CITE_CLASS}`)?.textContent).toBe("missing");
    });
});
