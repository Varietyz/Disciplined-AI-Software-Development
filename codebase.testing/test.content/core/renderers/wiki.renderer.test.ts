import { ANATOMY_PAGE, FAQ_PAGE, METHODOLOGY_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import type { Attribution, ChapterSource, PageSources, ShapeInput } from "@banes-lab/content/types/chapter.types.ts";
import { METHODOLOGY_REPOSITORY, SITE_URL, tabLink } from "@banes-lab/web/core/assets/link.assets.ts";
import { READING_TAB, TREE_TAB } from "@banes-lab/web/core/ids/anatomy.ids.ts";
import { describe, expect, it } from "vitest";
import { isSiteOnly, pageStemOf, renderWiki, wikiResolver } from "@banes-lab/content/core/renderers/wiki.renderer.ts";
import { attributionLine } from "@banes-lab/content/core/renderers/markdown.renderer.ts";

const ATTRIBUTION: Attribution = {
    author: "Author",
    copyright: "© 2025 ",
    coveredBy: "Documentation is covered by ",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    work: " - Work",
};

const INTRODUCTION: ChapterSource = {
    first: true,
    label: "Introduction",
    markdown:
        "# Page\n\nIntro alternate, see [the model](/disciplined-methodology/mental-model#loop), [the faq](/faq) and [a term](/ontology#architecture-x).\n",
    tab: "introduction",
};
const MODEL: ChapterSource = {
    first: false,
    label: "Mental Model",
    markdown: "# Mental model\n\nFirst alternate, back to [home](/disciplined-methodology#top).\n",
    tab: "mental-model",
};
const OBSERVATION: ChapterSource = {
    first: false,
    label: "Observation",
    markdown: "# Observation\n\nSecond alternate.\n",
    tab: "observation",
};
const SOURCES: ChapterSource[] = [INTRODUCTION, MODEL, OBSERVATION];

const FAQ: ChapterSource[] = [{ first: true, label: "FAQ", markdown: "# FAQ\n\nQuestions.\n", tab: FAQ_PAGE }];

const SINGLE: ShapeInput = { pages: [{ label: "Method", page: METHODOLOGY_PAGE, sources: SOURCES }], readme: null };
const MANY: ShapeInput = {
    pages: [
        { label: "Method", page: METHODOLOGY_PAGE, sources: SOURCES },
        { label: "FAQ", page: FAQ_PAGE, sources: FAQ },
    ],
    readme: null,
};

describe("pageStemOf", () => {
    it("numbers a page in reading order and joins the label's words with hyphens, prefixed by its group when the group adds a word", () => {
        expect(pageStemOf(MODEL, 1)).toBe("01-Mental-Model");
        expect(pageStemOf(OBSERVATION, 12)).toBe("12-Observation");
        expect(pageStemOf(OBSERVATION, 3, "Method")).toBe("03-Method.Observation");
        expect(pageStemOf(FAQ[0] ?? MODEL, 4, "FAQ")).toBe("04-FAQ");
    });
});

describe("wikiResolver", () => {
    it("maps a rendered route to its stem, the front page's own route to Home when it holds no numbered page, and the rest to nothing", () => {
        const pages = [
            { group: "Method", hosted: true, href: "01-Mental-Model", page: METHODOLOGY_PAGE, source: MODEL },
        ];
        const resolve = wikiResolver(pages, METHODOLOGY_PAGE);
        expect(resolve(METHODOLOGY_PAGE, "mental-model")).toBe("01-Mental-Model");
        expect(resolve(METHODOLOGY_PAGE, null)).toBe("Home");
        expect(resolve(FAQ_PAGE, null)).toBeNull();
    });
});

describe("renderWiki over one page", () => {
    const pages = renderWiki(SINGLE, ATTRIBUTION);
    const files = pages.map((page) => page.file);

    it("writes Home, one numbered page per tab, the sidebar and the footer", () => {
        expect(files).toStrictEqual([
            "Home.md",
            "01-Mental-Model.md",
            "02-Observation.md",
            "_Sidebar.md",
            "_Footer.md",
        ]);
    });

    it("opens Home with the page alternate and closes it with the reading path", () => {
        const home = pages[0]?.body ?? "";
        expect(home.startsWith("# Page")).toBe(true);
        expect(home).toContain("- [Mental Model](01-Mental-Model)\n- [Observation](02-Observation)");
    });

    it("rewrites a root-relative link to the wiki page that holds it, Home included, or to the site", () => {
        expect(pages[0]?.body).toContain("[the model](01-Mental-Model#loop)");
        expect(pages[0]?.body).toContain("[the faq](https://banes-lab.com/faq)");
        expect(pages[0]?.body).toContain("[a term](https://banes-lab.com/ontology#architecture-x)");
        expect(pages[1]?.body).toContain("[home](Home#top)");
    });

    it("links each page to its neighbors, Home standing in before the first", () => {
        expect(pages[1]?.body).toContain("[Home](Home) · [Observation](02-Observation)");
        expect(pages[2]?.body.trimEnd().endsWith("[Mental Model](01-Mental-Model)")).toBe(true);
    });

    it("lists Home, the reading path and the repository links in the sidebar", () => {
        const sidebar = pages[3]?.body ?? "";
        expect(sidebar).toContain("[Home](Home)");
        expect(sidebar).toContain("- [Mental Model](01-Mental-Model)");
        expect(sidebar).toContain(`[Repository](${METHODOLOGY_REPOSITORY})`);
        expect(sidebar).toContain(`[Discussions](${METHODOLOGY_REPOSITORY}/discussions)`);
    });

    it("carries the attribution line as the footer", () => {
        expect(pages[4]?.body.trimEnd()).toBe(attributionLine(ATTRIBUTION));
    });
});

describe("renderWiki over every teaching page", () => {
    const pages = renderWiki(MANY, ATTRIBUTION);

    it("numbers every tab of every page in order, first tabs included, prefixed by the page, and groups the reading path", () => {
        expect(pages.map((page) => page.file)).toStrictEqual([
            "Home.md",
            "01-Method.Introduction.md",
            "02-Method.Mental-Model.md",
            "03-Method.Observation.md",
            "04-FAQ.md",
            "_Sidebar.md",
            "_Footer.md",
        ]);
        expect(pages[0]?.body).toContain("**Method**\n- [Introduction](01-Method.Introduction)");
        expect(pages[0]?.body).toContain("**FAQ**\n- [FAQ](04-FAQ)");
        expect(pages[0]?.body.startsWith("# Page")).toBe(true);
    });

    it("resolves a link to another teaching page to its numbered wiki page", () => {
        expect(pages[0]?.body).toContain("[the faq](04-FAQ)");
        expect(pages[2]?.body).toContain("[home](01-Method.Introduction#top)");
    });
});

describe("renderWiki over a page with a site-only tab", () => {
    const anatomy: PageSources = {
        label: "Anatomy",
        page: ANATOMY_PAGE,
        sources: [
            {
                first: true,
                label: "Reading",
                markdown: "# Reading\n\nSee [the tree](/anatomy/tree#file-x).\n",
                tab: READING_TAB,
            },
            { first: false, label: "Source tree", markdown: "# Tree\n", tab: TREE_TAB },
        ],
    };
    const pages = renderWiki(
        { pages: [{ label: "Method", page: METHODOLOGY_PAGE, sources: SOURCES }, anatomy], readme: null },
        ATTRIBUTION,
    );

    it("keeps the derived tab off the wiki, lists it as a site link in the reading path and resolves links to it there", () => {
        expect(isSiteOnly(ANATOMY_PAGE, TREE_TAB)).toBe(true);
        expect(isSiteOnly(ANATOMY_PAGE, READING_TAB)).toBe(false);
        expect(pages.map((page) => page.file)).toStrictEqual([
            "Home.md",
            "01-Method.Introduction.md",
            "02-Method.Mental-Model.md",
            "03-Method.Observation.md",
            "04-Anatomy.Reading.md",
            "_Sidebar.md",
            "_Footer.md",
        ]);
        const tree = `${SITE_URL}${tabLink(ANATOMY_PAGE, TREE_TAB)}`;
        expect(pages[0]?.body).toContain(`**Anatomy**\n- [Reading](04-Anatomy.Reading)\n- [Source tree](${tree})`);
        expect(pages[4]?.body).toContain(`[the tree](${tree}#file-x)`);
        expect(pages[4]?.body.trimEnd().endsWith("[Observation](03-Method.Observation)")).toBe(true);
    });
});
