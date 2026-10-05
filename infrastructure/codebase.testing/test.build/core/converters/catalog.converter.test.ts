import { describe, expect, it } from "vitest";
import { idsLeaves, siteBuildOf, siteLeaf } from "@banes-lab/build-scripts/core/converters/catalog.converter.ts";
import type { Discovery } from "@banes-lab/build-scripts/types/site.types.ts";
import type { Entry } from "@banes-lab/build-scripts/types/catalog.types.ts";

const SITE = "https://example.test";

const DISCOVERY: Discovery = {
    author: "Ada",
    consent: "Crawl freely.",
    name: "Example",
    pages: [],
    routes: [],
    site: SITE,
    summary: "An example site.",
};

const ENTRY: Entry = {
    bytes: 12,
    fingerprint: "f",
    href: null,
    json: `${SITE}/json/api/route`,
    kind: "route",
    markdown: `${SITE}/api/route.md`,
    ref: "api:route",
    summary: null,
    title: "Learning route",
};

describe("idsLeaves, siteBuildOf and siteLeaf", () => {
    it("writes the id manifest as one shard per ref prefix, the build stamp and the root index", () => {
        const section = { ...ENTRY, ref: "chapter:/pag#grammar", title: "Grammar" };
        const [api, chapter, head] = idsLeaves([ENTRY, section, { ...ENTRY, ref: "api:search" }], SITE);
        expect(api?.identity.address.json).toBe("/json/api/ids/api");
        expect(api?.data).toMatchObject({
            count: 2,
            group: "api",
            rows: [
                ["api:route", "route", "Learning route", null, ENTRY.json, ENTRY.markdown, 12, "f"],
                ["api:search", "route", "Learning route", null, ENTRY.json, ENTRY.markdown, 12, "f"],
            ],
        });
        expect(chapter?.data).toMatchObject({ count: 1, group: "chapter" });
        expect(head?.data).toMatchObject({
            count: 3,
            kinds: ["index", "route"],
            shards: [
                { count: 2, group: "api", json: `${SITE}/json/api/ids/api` },
                { count: 1, group: "chapter", json: `${SITE}/json/api/ids/chapter` },
            ],
        });
        const idsHead = { ...ENTRY, fingerprint: "b1", json: `${SITE}/json/api/ids`, ref: "api:ids" };
        const build = siteBuildOf([idsHead], { "/a": { fingerprint: "x", lastmod: "2026-09-20" } }, SITE);
        expect(build).toStrictEqual({ build: "b1", published: ["/json/api/ids"], updated: "2026-09-20", version: 2 });
        expect(() => siteBuildOf([], {}, SITE)).toThrow("id manifest head");
        const parts = { collections: [], documents: [], pages: [], queries: [ENTRY], trees: [] };
        const site = siteLeaf(DISCOVERY, parts, build);
        expect(Reflect.get(site.data, "published")).toBeUndefined();
        expect(site.identity.address).toStrictEqual({ json: "/json/api", markdown: "/api.md" });
        expect(site.data).toMatchObject({ build: "b1", updated: "2026-09-20", version: 2 });
        expect(site.markdown).toContain("## Address patterns");
        expect(site.markdown).toContain(`[Learning route](${SITE}/api/route.md)`);
        expect(site.markdown).toContain("Crawl freely.");
        expect(site.markdown).toContain("Catalog version 2, last changed on 2026-09-20, build b1.");
    });

    it("splits a group over the part budget into numbered shards the head lists in order", () => {
        const long = "x".repeat(2048);
        const many = Array.from({ length: 400 }, (_unused, at) => ({
            ...ENTRY,
            ref: `lexicon:t${String(at)}`,
            summary: long,
        }));
        const leaves = idsLeaves(many, SITE);
        const shards = leaves.slice(0, -1);
        expect(shards.length).toBeGreaterThan(1);
        expect(shards[0]?.identity.address.json).toBe("/json/api/ids/lexicon/_1");
        expect(shards[0]?.identity.title).toContain("part 1 of");
    });
});
