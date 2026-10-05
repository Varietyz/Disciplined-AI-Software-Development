import { LICENSE_META, LICENSE_SECTIONS } from "@banes-lab/web/configuration/strings/license.strings.ts";
import { TERMS_META, TERMS_SECTIONS } from "@banes-lab/web/configuration/strings/terms.strings.ts";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderDocument, renderDocumentSections } from "@banes-lab/web/presentation/renderers/document.renderer.ts";

const SECTION_CLASS = "chapter-section";
const CONTENTS_LINK_CLASS = "contents-link";
const EMBLEM_CLASS = "tab-page-emblem";
const MARK_CLASS = "contents-mark";

class FakeIntersectionObserver {
    public observe(): void {}

    public disconnect(): void {}
}

beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("renderDocument", () => {
    it("renders one section and one contents link per declared section", () => {
        const article = renderDocument(TERMS_META, TERMS_SECTIONS);
        expect(article.querySelectorAll(`.${SECTION_CLASS}`)).toHaveLength(TERMS_SECTIONS.length);
        expect(article.querySelectorAll(`.${CONTENTS_LINK_CLASS}`)).toHaveLength(TERMS_SECTIONS.length);
    });

    it("gives every section the id its contents link points at", () => {
        const article = renderDocument(TERMS_META, TERMS_SECTIONS);
        for (const link of article.querySelectorAll<HTMLAnchorElement>(`.${CONTENTS_LINK_CLASS}`)) {
            expect(article.querySelector(link.hash)).not.toBeNull();
        }
    });

    it("marks each contents link with the letter its section heading carries", () => {
        const article = renderDocument(TERMS_META, TERMS_SECTIONS);
        const marks = [...article.querySelectorAll(`.${MARK_CLASS}`)].map((mark) => mark.textContent);
        const headings = [...article.querySelectorAll(".chapter-section-title .chapter-label")].map(
            (label) => label.textContent,
        );
        expect(marks).toStrictEqual(headings);
    });

    it("shows the emblem only when the meta declares one", () => {
        expect(renderDocument(TERMS_META, TERMS_SECTIONS).querySelector(`.${EMBLEM_CLASS}`)).toBeNull();
        expect(renderDocument(LICENSE_META, LICENSE_SECTIONS).querySelector(`.${EMBLEM_CLASS}`)).not.toBeNull();
    });

    it("renders bare sections with the same section markup and no contents or header", () => {
        const article = renderDocumentSections(TERMS_SECTIONS);
        expect(article.querySelectorAll(`.${SECTION_CLASS}`)).toHaveLength(TERMS_SECTIONS.length);
        expect(article.querySelector(`.${CONTENTS_LINK_CLASS}`)).toBeNull();
        expect(article.textContent).not.toContain(TERMS_META.version);
    });

    it("puts the title and version in the rendered text", () => {
        const text = renderDocument(TERMS_META, TERMS_SECTIONS).textContent;
        expect(text).toContain(TERMS_META.title);
        expect(text).toContain(TERMS_META.version);
    });
});
