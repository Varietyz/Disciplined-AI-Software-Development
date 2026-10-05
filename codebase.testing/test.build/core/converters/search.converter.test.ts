import { describe, expect, it } from "vitest";
import {
    fileEntries,
    queryLeaf,
    recordEntries,
    searchRulesOf,
    searchSections,
    sectionEntries,
} from "@banes-lab/build-scripts/core/converters/search.converter.ts";
import type { Identity } from "@banes-lab/build-scripts/types/catalog.types.ts";
import { VOCABULARY_MODULE } from "./vocabulary.fixture.ts";
import { createLinker } from "@banes-lab/build-scripts/core/resolvers/link.resolver.ts";

const SITE = "https://example.test";
const RULES = {
    americanWords: {},
    fuzzyMinimum: 4,
    izeStems: [],
    izeSuffixes: {},
    pluralIes: ["ies", "y"] as const,
    pluralKeptAfter: ["i", "s", "u"],
    pluralMinimum: 4,
    pluralSuffix: "s",
    spellingPrefixes: [],
    wordCharacters: "abc",
};

const section = function section(id: string): Identity {
    return {
        address: { json: `/json/method/${id}`, markdown: `/method/${id}.md` },
        href: `/method#${id}`,
        kind: "section",
        ref: `chapter:/method#${id}`,
        summary: null,
        title: id,
    };
};

const RECORD: Identity = {
    address: { json: "/json/records/architecture/dry", markdown: "/records/architecture/dry.md" },
    href: "/ontology#dry",
    kind: "principle",
    ref: "architecture:dry",
    summary: "One home per fact",
    title: "Do not repeat",
};

const LINKER = createLinker([section("late"), section("early"), section("unplaced")], SITE, (href) => href);

const words = function words(text: string): readonly string[] {
    return text
        .toLowerCase()
        .split(" ")
        .filter((word) => word.length > 0);
};

describe("searchRulesOf", () => {
    it("publishes the fuzzy minimum and the word-folding rules the site search applies", () => {
        const rules = searchRulesOf({ searchConstants: { FUZZY_MIN_TERM_LENGTH: 4 }, vocabulary: VOCABULARY_MODULE });
        expect(rules.fuzzyMinimum).toBe(4);
        expect(rules.pluralKeptAfter).toStrictEqual(["i", "s", "u"]);
        expect(rules.americanWords["colour"]).toBe("color");
        expect(rules.izeStems).toContain("normal");
        expect(rules.spellingPrefixes).toContain("de");
        expect(rules.izeSuffixes["isation"]).toBe("ization");
        expect(JSON.stringify(rules)).not.toContain("authorisably");
    });
});

describe("searchSections", () => {
    it("reads one row per section the site search index holds, and none for an empty index", async () => {
        const empty = { evidence: new Map(), links: new Map(), route: new Map(), sources: [] };
        const web = {
            analyzer: { anchorPath: () => "", textsOf: () => [] },
            corpus: {
                loadCorpus: async () => {
                    await Promise.resolve();
                    return { definitions: [], pages: [], positions: { evidence: {}, links: {}, route: {} } };
                },
            },
            matcher: { markupWords: () => [] },
            search: { indexOf: () => empty, positionOf: () => 0 },
        };
        await expect(searchSections(web)).resolves.toStrictEqual([]);
    });
});

describe("sectionEntries", () => {
    it("keeps the sections the linker knows, ranked by teaching position with the unplaced last", () => {
        const entries = sectionEntries(
            [
                { href: "/method#late", position: 9, words: ["gate"] },
                { href: "/method#unplaced", position: Number.POSITIVE_INFINITY, words: ["gate"] },
                { href: "/method#early", position: 2, words: ["gate"] },
                { href: "/method#gone", position: 1, words: ["gate"] },
            ],
            LINKER,
        );
        expect(entries.map((entry) => [entry.identity.title, entry.position])).toStrictEqual([
            ["early", 2],
            ["late", 9],
            ["unplaced", null],
        ]);
    });
});

describe("recordEntries and fileEntries", () => {
    it("index a record by its name, summary and aliases, and a file by its path and definition names", () => {
        const [record] = recordEntries([RECORD], [{ phrase: "dry", ref: "architecture:dry" }], words);
        expect(record?.words).toStrictEqual(["do", "not", "repeat", "one", "home", "per", "fact", "dry"]);
        const file = {
            file: { definitions: [{ name: "gate" }], path: "core gate" },
            identity: { ...RECORD, ref: "anatomy:x", title: "b" },
        };
        const other = { ...file, identity: { ...file.identity, title: "a" } };
        const files = fileEntries([file, other], words);
        expect(files.map((entry) => [entry.identity.title, entry.words])).toStrictEqual([
            ["a", ["core", "gate", "gate"]],
            ["b", ["core", "gate", "gate"]],
        ]);
    });
});

describe("queryLeaf", () => {
    it("publishes the query endpoint with its parameters, messages and limits", () => {
        const leaf = queryLeaf(SITE, ["requires", "enables", "requires"]);
        expect(leaf.identity.address.json).toBe("/json/api/query");
        expect(leaf.data).toMatchObject({
            endpoint: `${SITE}/q`,
            limits: { defaultLimit: 50, depth: 3, limit: 200 },
            relations: ["enables", "requires"],
            site: SITE,
        });
        const parameters: unknown = Reflect.get(leaf.data, "parameters");
        expect(Object.keys(parameters ?? {})).toContain("walk");
        expect(Reflect.get(parameters ?? {}, "depth")).toBe("With walk, how many steps to follow, from 1 to 3");
    });
});
