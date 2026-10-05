import {
    FOLLOWS,
    UNPLACED,
    anchorPath,
    anchorsLinkedFrom,
    anchorsOf,
    evidenceOf,
    isGlossary,
    linksOf,
    placeOf,
    routeOf,
    textsOf,
} from "@banes-lab/web/core/analyzers/search.analyzer.ts";
import { describe, expect, it } from "vitest";
import type { SearchSource } from "@banes-lab/web/types/search.types.ts";
import type { Section } from "@banes-lab/web/types/document.types.ts";

const ICON = "bi-x";
const DRIFT = "lexicon-drift";

const LINKING: Section = {
    icon: ICON,
    id: "linking",
    intro: 'See <a href="/ontology/lexicon#lexicon-drift">drift</a>.',
    subsections: [],
    title: "Linking",
};

const GLOSSED: Section = {
    blocks: [{ entries: [{ description: "d", id: DRIFT, term: "Drift" }], kind: "glossary" }],
    icon: ICON,
    id: "glossed",
    subsections: [{ id: "named", title: "Named" }, { title: "Unnamed" }],
    title: "Glossed",
};

const CHAPTER: SearchSource = {
    first: false,
    icon: ICON,
    label: "Method — Build",
    layout: "chapter",
    page: "method",
    tab: { icon: ICON, id: "build", label: "Build", sections: [LINKING] },
    tone: "methodology",
};

const DOCUMENT: SearchSource = { ...CHAPTER, layout: "document", page: "terms", tone: null };

describe("textsOf", () => {
    it("collects every string a reader could see and skips identifiers", () => {
        expect(textsOf(GLOSSED)).toStrictEqual(["d", "Drift", "Named", "Unnamed", "Glossed"]);
    });
});

describe("anchorPath", () => {
    it("addresses a tab section by tab link and a document section by page anchor", () => {
        expect(anchorPath(CHAPTER, "linking")).toBe("/method/build#linking");
        expect(anchorPath(DOCUMENT, "linking")).toBe("/terms#linking");
    });

    it("addresses a first-tab section by the page path, because the first tab is served there", () => {
        expect(anchorPath({ ...CHAPTER, first: true }, "linking")).toBe("/method#linking");
    });
});

describe("routeOf", () => {
    it("keeps the earliest position of a repeated stop", () => {
        const route = routeOf(["/a#x", "/b#y", "/a#x"]);
        expect(route.get("/a#x")).toBe(0);
        expect(route.get("/b#y")).toBe(1);
    });
});

describe("anchorsLinkedFrom and linksOf", () => {
    it("places each linked anchor at the earliest route stop that links to it", () => {
        expect(anchorsLinkedFrom(LINKING)).toStrictEqual([DRIFT]);
        const links = linksOf([CHAPTER], routeOf(["/other#z", "/method/build#linking"]));
        expect(links.get(DRIFT)).toBe(1 + FOLLOWS);
    });

    it("ignores sections the route never reaches", () => {
        expect(linksOf([CHAPTER], routeOf(["/other#z"])).size).toBe(0);
    });
});

describe("evidenceOf", () => {
    it("places a cited definition at the chapter section that cites it", () => {
        const positions = evidenceOf(
            [
                {
                    nodes: [
                        { file: null, kind: "definition", name: "renderChapter" },
                        { kind: "file", name: "x" },
                    ],
                    subject: { kind: "chapter", page: "method", section: "linking", tab: "build" },
                },
                { nodes: [{ file: null, kind: "definition", name: "orphan" }], subject: { kind: "record", ref: "r" } },
            ],
            routeOf(["/method/build#linking"]),
            new Map([["method", "start"]]),
        );
        expect(positions.get("renderChapter")).toBe(FOLLOWS);
        expect(positions.has("orphan")).toBe(false);
    });

    it("keys a citation on a first tab by the page path the route uses", () => {
        const positions = evidenceOf(
            [
                {
                    nodes: [{ file: null, kind: "definition", name: "renderStart" }],
                    subject: { kind: "chapter", page: "method", section: "loop", tab: "start" },
                },
            ],
            routeOf(["/method#loop"]),
            new Map([["method", "start"]]),
        );
        expect(positions.get("renderStart")).toBe(FOLLOWS);
    });
});

describe("anchorsOf, isGlossary and placeOf", () => {
    it("names the section, its named subsections and its glossary entries", () => {
        expect(anchorsOf(GLOSSED)).toStrictEqual(["glossed", "named", DRIFT]);
        expect(isGlossary({ kind: "text", text: "t" })).toBe(false);
    });

    it("takes the earliest known anchor, or leaves the section unplaced", () => {
        const links = new Map([
            ["named", 4],
            [DRIFT, 2],
        ]);
        expect(placeOf(anchorsOf(GLOSSED), links)).toBe(2);
        expect(placeOf(["nowhere"], links)).toBe(UNPLACED);
    });
});
