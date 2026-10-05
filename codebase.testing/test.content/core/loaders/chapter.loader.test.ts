import { ANATOMY_PAGE, FAQ_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { REPOSITORY_PAGES, TEACHING_PAGES } from "@banes-lab/content/configuration/constants/readme.constants.ts";
import {
    attributionOf,
    chapterSourcesOf,
    pageSourcesOf,
    pagesFor,
    rendererFor,
    shapeInputOf,
    shapeOf,
    surfaceFolder,
    twinFilesOf,
} from "@banes-lab/content/core/loaders/chapter.loader.ts";
import { describe, expect, it } from "vitest";
import { METHODOLOGY_AUTHOR } from "@banes-lab/web/configuration/strings/page.strings.ts";
import type { PagePayload } from "@banes-lab/content/types/leak.types.ts";
import { relativePath } from "@ssot/paths";
import { renderChapters } from "@banes-lab/content/core/renderers/chapter.renderer.ts";
import { renderWiki } from "@banes-lab/content/core/renderers/wiki.renderer.ts";

describe("attributionOf", () => {
    it("reads the author and license from the site's own strings", () => {
        const held = attributionOf();
        expect(held.author).toBe(METHODOLOGY_AUTHOR);
        expect(held.licenseUrl.startsWith("https://")).toBe(true);
    });
});

describe("shapeOf and rendererFor", () => {
    it("defaults to the repository shape, accepts wiki and refuses anything else", () => {
        expect(shapeOf(null)).toBe("repository");
        expect(shapeOf("repository")).toBe("repository");
        expect(shapeOf("wiki")).toBe("wiki");
        expect(shapeOf("blog")).toBeNull();
        expect(rendererFor("repository")).toBe(renderChapters);
        expect(rendererFor("wiki")).toBe(renderWiki);
    });

    it("renders every teaching page for the wiki, and for the repository the set without the anatomy and the FAQ the README already carries", () => {
        expect(pagesFor("wiki")).toBe(TEACHING_PAGES);
        expect(pagesFor("repository")).toBe(REPOSITORY_PAGES);
        expect(REPOSITORY_PAGES).not.toContain(ANATOMY_PAGE);
        expect(REPOSITORY_PAGES).not.toContain(FAQ_PAGE);
    });
});

describe("pageSourcesOf and shapeInputOf", () => {
    it("answer null for a page with no build, and for a shape whose pages are not all built", () => {
        expect(pageSourcesOf("no-such-page")).toBeNull();
        const input = shapeInputOf("wiki");
        expect(input === null || input.pages.length === TEACHING_PAGES.length).toBe(true);
    });
});

describe("surfaceFolder", () => {
    it("resolves the repository shape to the methodology checkout and the wiki shape to its wiki checkout", () => {
        expect(surfaceFolder("repository").split("\\").join("/")).toContain(relativePath("methodology"));
        expect(surfaceFolder("wiki").split("\\").join("/")).toContain(relativePath("methodology.wiki"));
    });
});

describe("chapterSourcesOf", () => {
    it("returns null when a page has no built alternate", () => {
        const payload: PagePayload = {
            file: "none",
            label: "None",
            page: "no-such-page",
            sections: [],
            strings: [],
            tabs: [{ id: "first", label: "First" }],
            title: "None",
        };
        expect(chapterSourcesOf(payload)).toBeNull();
    });
});

const posix = function posix(files: string[]): string[] {
    return files.map((file) => file.split("\\").join("/"));
};

describe("twinFilesOf", () => {
    const base: PagePayload = {
        file: "none",
        label: "Guide",
        page: "guide",
        sections: [],
        strings: [],
        tabs: [],
        title: "Guide",
    };
    it("names the page alternate for a page without tabs, and the page then each later tab for one with tabs", () => {
        const [single] = posix(twinFilesOf(base));
        expect(single?.endsWith(`${relativePath("builds.web")}/guide.md`)).toBe(true);
        const tabbed = posix(
            twinFilesOf({
                ...base,
                tabs: [
                    { id: "one", label: "One" },
                    { id: "two", label: "Two" },
                ],
            }),
        );
        expect(tabbed).toHaveLength(2);
        expect(tabbed[0]?.endsWith("/guide.md")).toBe(true);
        expect(tabbed[1]?.endsWith("/guide/two.md")).toBe(true);
    });
});
