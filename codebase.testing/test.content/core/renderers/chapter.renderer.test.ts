import { ANATOMY_PAGE, GRAMMAR_PAGE, METHODOLOGY_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import type {
    Attribution,
    Chapter,
    ChapterSource,
    PageSources,
    ShapeInput,
} from "@banes-lab/content/types/chapter.types.ts";
import { attributionLine, link, tabFileOf } from "@banes-lab/content/core/renderers/markdown.renderer.ts";
import {
    chapterPathOf,
    renderChapters,
    repositoryResolver,
} from "@banes-lab/content/core/renderers/chapter.renderer.ts";
import { describe, expect, it } from "vitest";
import { isRepositoryPage, pageFolderOf } from "@banes-lab/content/core/normalizers/readme.normalizer.ts";
import { renderWiki } from "@banes-lab/content/core/renderers/wiki.renderer.ts";
import { unstableChapters } from "@banes-lab/content/core/validators/chapter.validator.ts";

const ATTRIBUTION: Attribution = {
    author: "Author",
    copyright: "© 2025 ",
    coveredBy: "Documentation is covered by ",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    work: " - Work",
};

const FIRST: ChapterSource = {
    first: true,
    label: "Introduction",
    markdown:
        "# Page\n\nIntro alternate, see [stages](/disciplined-methodology/stages#loop), [the guide](/pag/guide) and [terms](/ontology#architecture-x).\n",
    tab: "introduction",
};
const STAGES: ChapterSource = {
    first: false,
    label: "Stages",
    markdown: "# Stages\n\nStages alternate.\n",
    tab: "stages",
};
const METHOD: PageSources = { label: "Method", page: METHODOLOGY_PAGE, sources: [FIRST, STAGES] };
const GUIDE: ChapterSource = {
    first: false,
    label: "Guide",
    markdown: "# Guide\n\nBack to [stages](/disciplined-methodology/stages).\n",
    tab: "guide",
};
const GRAMMAR: PageSources = {
    label: "PAG",
    page: GRAMMAR_PAGE,
    sources: [{ first: true, label: "Introduction", markdown: "# PAG\n", tab: "introduction" }, GUIDE],
};

const INPUT: ShapeInput = { pages: [METHOD, GRAMMAR], readme: null };

describe("pageFolderOf, chapterPathOf, tabFileOf and attributionLine", () => {
    it("keeps the methodology at the root and gives every other page a folder named by its label", () => {
        expect(pageFolderOf(METHODOLOGY_PAGE, "Method")).toBe("");
        expect(pageFolderOf(GRAMMAR_PAGE, "PAG")).toBe("pag");
        expect(pageFolderOf("x", "Two Words")).toBe("two-words");
        expect(isRepositoryPage(GRAMMAR_PAGE)).toBe(true);
        expect(isRepositoryPage(ANATOMY_PAGE)).toBe(false);
    });

    it("names the first methodology tab README while no README is composed, and every tab by its upper-cased id", () => {
        expect(chapterPathOf(METHOD, FIRST, false)).toBe("README.md");
        expect(chapterPathOf(METHOD, FIRST, true)).toBe("INTRODUCTION.md");
        expect(chapterPathOf(METHOD, STAGES, false)).toBe("STAGES.md");
        expect(chapterPathOf(GRAMMAR, GUIDE, false)).toBe("pag/GUIDE.md");
        expect(tabFileOf("build")).toBe("BUILD.md");
    });

    it("composes a markdown link", () => {
        expect(link("Stages", "STAGES.md")).toBe("[Stages](STAGES.md)");
    });

    it("composes the attribution line from the existing strings", () => {
        expect(attributionLine(ATTRIBUTION)).toBe(
            "© 2025 Author - Work · Documentation is covered by [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)",
        );
    });
});

describe("repositoryResolver", () => {
    it("maps every rendered route to its chapter file relative to the linking folder, and an unrendered route to nothing", () => {
        const fromRoot = repositoryResolver(INPUT.pages, false, "");
        expect(fromRoot(METHODOLOGY_PAGE, null)).toBe("README.md");
        expect(fromRoot(METHODOLOGY_PAGE, "stages")).toBe("STAGES.md");
        expect(fromRoot(GRAMMAR_PAGE, "guide")).toBe("pag/GUIDE.md");
        expect(fromRoot(METHODOLOGY_PAGE, "gone")).toBeNull();
        expect(fromRoot("ontology", null)).toBeNull();
        const fromFolder = repositoryResolver(INPUT.pages, true, "pag");
        expect(fromFolder(METHODOLOGY_PAGE, null)).toBe("../INTRODUCTION.md");
        expect(fromFolder(GRAMMAR_PAGE, null)).toBe("INTRODUCTION.md");
    });
});

describe("renderChapters", () => {
    const chapters = renderChapters(INPUT, ATTRIBUTION);

    it("writes the methodology at the root and every other page in its folder", () => {
        expect(chapters.map((chapter) => chapter.file)).toStrictEqual([
            "README.md",
            "STAGES.md",
            "pag/INTRODUCTION.md",
            "pag/GUIDE.md",
        ]);
    });

    it("opens every chapter with the attribution and closes it with its page's footer", () => {
        for (const chapter of chapters) {
            expect(chapter.body.startsWith(attributionLine(ATTRIBUTION))).toBe(true);
        }
        expect(chapters[1]?.body).toContain("[README](README.md) · [Stages](STAGES.md)");
        expect(chapters[3]?.body).toContain("[Introduction](INTRODUCTION.md) · [Guide](GUIDE.md)");
    });

    it("lists the chapters in the README only", () => {
        expect(chapters[0]?.body).toContain("- [Stages](STAGES.md)");
        expect(chapters[1]?.body).not.toContain("- [Stages](STAGES.md)");
    });

    it("rewrites a root-relative link to a chapter file, climbing out of a folder, or to the site", () => {
        expect(chapters[0]?.body).toContain("[stages](STAGES.md#loop)");
        expect(chapters[0]?.body).toContain("[the guide](pag/GUIDE.md)");
        expect(chapters[0]?.body).toContain("[terms](https://banes-lab.com/ontology#architecture-x)");
        expect(chapters[3]?.body).toContain("[stages](../STAGES.md)");
    });
});

describe("unstableChapters", () => {
    it("finds no difference between two renders of the same sources", () => {
        expect(unstableChapters(renderChapters, INPUT, ATTRIBUTION)).toStrictEqual([]);
        expect(unstableChapters(renderWiki, INPUT, ATTRIBUTION)).toStrictEqual([]);
    });

    it("reports a chapter whose render is not a pure function of its sources", () => {
        let calls = 0;
        const drifting = function drifting(): Chapter[] {
            calls += 1;
            return [{ body: String(calls), file: "README.md", label: "README" }];
        };
        expect(unstableChapters(drifting, INPUT, ATTRIBUTION)).toStrictEqual(["README.md"]);
    });
});
