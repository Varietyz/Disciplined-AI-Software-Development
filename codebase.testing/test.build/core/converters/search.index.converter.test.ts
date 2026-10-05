import { describe, expect, it } from "vitest";
import type { Identity } from "@banes-lab/build-scripts/types/catalog.types.ts";
import { createLinker } from "@banes-lab/build-scripts/core/resolvers/link.resolver.ts";
import { searchLeaves } from "@banes-lab/build-scripts/core/converters/search.index.converter.ts";
import { sectionEntries } from "@banes-lab/build-scripts/core/converters/search.converter.ts";

const SITE = "https://example.test";
const ROW_COUNT = 6000;
const LONG = 80;
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

const LINKER = createLinker([section("late"), section("early")], SITE, (href) => href);

describe("searchLeaves", () => {
    it("names one index per kind, and shards each kind's weighted postings by prefix", () => {
        const entries = sectionEntries(
            [
                { href: "/method#late", position: 9, words: ["gate", "check"] },
                { href: "/method#early", position: 2, words: ["gate", "gate"] },
            ],
            LINKER,
        );
        const [head, kind, ...shards] = searchLeaves([{ entries, kind: "sections" }], RULES, LINKER);
        expect(head?.identity.address.json).toBe("/json/api/search");
        expect(Reflect.get(head?.data ?? {}, "kinds")).toStrictEqual({
            sections: { count: 2, json: `${SITE}/json/api/search/sections` },
        });
        expect(Reflect.get(kind?.data ?? {}, "columns")).toStrictEqual(["ref", "title", "position"]);
        expect(Reflect.get(kind?.data ?? {}, "rows")).toStrictEqual([
            ["chapter:/method#early", "early", 2],
            ["chapter:/method#late", "late", 9],
        ]);
        expect(Reflect.get(kind?.data ?? {}, "shards")).toStrictEqual({
            c: `${SITE}/json/api/search/sections/c`,
            g: `${SITE}/json/api/search/sections/g`,
        });
        const postings = shards.map((shard): readonly unknown[] => {
            const held: unknown = Reflect.get(shard.data, "postings");
            return [shard.identity.address.json, held];
        });
        expect(postings).toStrictEqual([
            ["/json/api/search/sections/c", { check: [[1, 1]] }],
            [
                "/json/api/search/sections/g",
                {
                    gate: [
                        [0, 2],
                        [1, 1],
                    ],
                },
            ],
        ]);
    });

    it("moves a kind's rows into numbered parts when its index passes the file budget", () => {
        const entries = Array.from({ length: ROW_COUNT }, (_unused, at) => ({
            identity: {
                address: { json: `/json/x/${String(at)}`, markdown: null },
                href: null,
                kind: "file",
                ref: `anatomy:file-${"x".repeat(LONG)}-${String(at)}`,
                summary: null,
                title: `${"y".repeat(LONG)}-${String(at)}`,
            },
            position: null,
            words: [`w${String(at)}`],
        }));
        const [, kind, ...rest] = searchLeaves([{ entries, kind: "files" }], RULES, LINKER);
        const parts: unknown = Reflect.get(kind?.data ?? {}, "parts");
        expect(Reflect.get(kind?.data ?? {}, "rows")).toStrictEqual([]);
        expect(Array.isArray(parts) && parts.length > 1).toBe(true);
        const partLeaves = rest.filter((leaf) => leaf.identity.address.json.includes("/files/_"));
        const rows = partLeaves.flatMap((leaf): unknown[] => {
            const held: unknown = Reflect.get(leaf.data, "rows");
            return Array.isArray(held) ? held : [];
        });
        expect(rows).toHaveLength(ROW_COUNT);
    });
});
