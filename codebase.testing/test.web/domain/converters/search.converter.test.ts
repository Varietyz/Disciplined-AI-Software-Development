import type { PageContent, PageDefinition } from "@banes-lab/web/types/page.types.ts";
import type { SearchCorpus, SearchPage } from "@banes-lab/web/types/search.types.ts";
import { definitionMatches, searchSpreads, spreadsOf } from "@banes-lab/web/domain/converters/search.converter.ts";
import { describe, expect, it } from "vitest";
import {
    indexOf,
    positionOf,
    positionsOf,
    sourcesOf,
} from "@banes-lab/web/domain/converters/search.index.converter.ts";
import { narrowSection, narrowSubsection } from "@banes-lab/web/domain/converters/search.fragment.converter.ts";
import type { Section } from "@banes-lab/web/types/document.types.ts";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";

const ICON = "bi-x";

const section = function section(id: string, title: string, text: string): Section {
    return { icon: ICON, id, subsections: [{ content: text, title: `${title} detail` }], title };
};

const page = function page(id: string, content: PageContent): SearchPage {
    const definition: PageDefinition = {
        content,
        description: id,
        id,
        render: () => createElement("div"),
        title: id.toUpperCase(),
    };
    return { definition, icon: ICON };
};

const GLOSSARY: Section = {
    blocks: [
        {
            entries: [
                { description: "A slow departure from the rule.", id: "lexicon-drift", term: "Drift" },
                { description: "Unrelated.", id: "lexicon-other", term: "Other" },
            ],
            kind: "glossary",
        },
    ],
    icon: ICON,
    id: "lexicon",
    subsections: [],
    title: "Lexicon",
};

const METHOD = page("method", {
    kind: "tabbed",
    layout: "chapter",
    meta: { subtitle: "s", title: "Method", version: "1" },
    tabs: [
        {
            icon: ICON,
            id: "build",
            label: "Build",
            sections: [
                section("early", "Early", "the gate holds"),
                {
                    ...section("late", "Late", "the gate again"),
                    intro: 'Watch for <a href="/words/terms#lexicon-drift">drift</a>.',
                },
            ],
        },
        { icon: ICON, id: "files", label: "Files", layout: "tree", sections: [section("tree", "Tree", "gate")] },
    ],
    tone: "methodology",
});

const WORDS = page("words", {
    kind: "tabbed",
    layout: "grid",
    meta: { subtitle: "s", title: "Words", version: "1" },
    tabs: [{ icon: ICON, id: "terms", label: "Terms", layout: "glossary", sections: [GLOSSARY] }],
    tone: "ontology",
});

const LEGAL = page("legal", {
    kind: "document",
    meta: { closing: "c", effectiveDate: "e", lastUpdated: "l", title: "Legal", version: "1" },
    sections: [section("gatehouse", "Gatehouse", "a gate by the road")],
});

const PAGES = [LEGAL, WORDS, METHOD];

const CORPUS: SearchCorpus = {
    definitions: [
        { file: "presentation/gate.renderer.ts", line: 1, name: "renderGate" },
        { file: "core/gate.analyzer.ts", line: 1, name: "gateOrder" },
    ],
    pages: PAGES,
    positions: positionsOf({
        evidence: [
            {
                nodes: [{ file: null, kind: "definition", name: "gateOrder" }],
                subject: { kind: "chapter", page: "method", section: "late", tab: "build" },
            },
        ],
        pages: PAGES,
        route: ["/method#late", "/method#early"],
    }),
};

describe("narrowSection and narrowSubsection", () => {
    it("keeps a section whole when its own prose holds every word", () => {
        const whole = section("s", "The gate", "detail");
        expect(narrowSection(["gate"], whole)).toBe(whole);
    });

    it("keeps only the matching subsection when the section itself does not match", () => {
        const mixed: Section = {
            icon: ICON,
            id: "mixed",
            intro: "Unrelated lead.",
            subsections: [
                { content: "the gate", title: "One" },
                { content: "nothing", title: "Two" },
            ],
            title: "Mixed",
        };
        const narrowed = narrowSection(["gate"], mixed);
        expect(narrowed?.subsections.map((sub) => sub.title)).toStrictEqual(["One"]);
        expect(narrowed?.intro).toBeUndefined();
        expect(narrowSubsection(["gate"], { content: "nothing", title: "Two" })).toBeNull();
    });

    it("narrows a glossary to the entries that match", () => {
        const narrowed = narrowSection(["drift"], GLOSSARY);
        const [block] = narrowed?.blocks ?? [];
        expect(block?.kind === "glossary" ? block.entries.map((entry) => entry.term) : []).toStrictEqual(["Drift"]);
        expect(narrowSection(["absent"], GLOSSARY)).toBeNull();
    });
});

describe("sourcesOf", () => {
    it("searches every tab but the tree, and a document as one source", () => {
        expect(sourcesOf(METHOD).map((source) => source.tab.id)).toStrictEqual(["build"]);
        expect(sourcesOf(LEGAL).map((source) => [source.layout, source.tone])).toStrictEqual([["document", null]]);
    });
});

describe("indexOf and positionOf", () => {
    it("builds the index once per corpus and places a section by the route, else by the first link to it", () => {
        const index = indexOf(CORPUS);
        expect(indexOf(CORPUS)).toBe(index);
        expect(index.sources.map((source) => source.page)).toStrictEqual(["legal", "words", "method"]);
        const method = index.sources.find((source) => source.page === "method");
        const words = index.sources.find((source) => source.page === "words");
        const [early, late] = method?.tab.sections ?? [];
        if (method === undefined || words === undefined || early === undefined || late === undefined) {
            throw new Error("the corpus has a method source with two sections and a words source");
        }
        expect(positionOf(index, method, late)).toBe(0);
        expect(positionOf(index, method, early)).toBe(1);
        expect(positionOf(index, words, GLOSSARY)).toBe(0.5);
    });
});

describe("definitionMatches", () => {
    it("matches a definition name by every term it contains", () => {
        const [renderGate] = CORPUS.definitions;
        expect(renderGate === undefined ? false : definitionMatches(["gate"], renderGate)).toBe(true);
        expect(renderGate === undefined ? true : definitionMatches(["ga"], renderGate)).toBe(false);
    });
});

describe("searchSpreads", () => {
    it("walks the results in teaching order, not in page order", () => {
        const spreads = searchSpreads(CORPUS, "gate");
        const walk = spreads.flatMap((spread) => spread.sections.map((hit) => hit.id));
        expect(walk[0]).toBe("late");
        expect(walk.indexOf("late")).toBeLessThan(walk.indexOf("early"));
        expect(walk).toContain("gatehouse");
        expect(walk.indexOf("gatehouse")).toBeGreaterThan(walk.indexOf("early"));
    });

    it("places a definition where a chapter cites it, and the uncited ones after", () => {
        const spreads = searchSpreads(CORPUS, "gate");
        const titles = spreads.flatMap((spread) => spread.sections.map((hit) => hit.title));
        expect(titles.indexOf("gateOrder")).toBeLessThan(titles.indexOf("Early"));
        expect(titles.indexOf("renderGate")).toBeGreaterThan(titles.indexOf("Early"));
    });

    it("places a glossary entry where the teaching first links to it", () => {
        const spreads = searchSpreads(CORPUS, "drift");
        expect(spreads.map((spread) => spread.source.page)).toStrictEqual(["method", "words"]);
        expect(spreads[1]?.home).toBe("/words#lexicon");
    });

    it("returns nothing for a query with no words", () => {
        expect(searchSpreads(CORPUS, " ")).toStrictEqual([]);
    });
});

describe("spreadsOf", () => {
    it("merges consecutive hits from one source into one spread", () => {
        const [source] = sourcesOf(METHOD);
        if (source === undefined) {
            throw new Error("the method page has a build source");
        }
        const hit = { home: "/h", position: 0, section: GLOSSARY, sectionIndex: 0, source, sourceIndex: 0 };
        expect(spreadsOf([hit, { ...hit, sectionIndex: 1 }])).toHaveLength(1);
    });
});
