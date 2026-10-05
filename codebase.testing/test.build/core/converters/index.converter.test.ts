import { DISCOVERY, FACET_GROUP, SITE, entry } from "./index.fixture.ts";
import { describe, expect, it } from "vitest";
import { indexLeaves, indexPlansOf, isIndexHead } from "@banes-lab/build-scripts/core/converters/index.converter.ts";
import { facetIndexPlans } from "@banes-lab/build-scripts/core/converters/index.filter.converter.ts";
import { sectionPlans } from "@banes-lab/build-scripts/core/converters/section.converter.ts";

describe("indexPlansOf", () => {
    it("plans every index family from one scope: collections, facets, levels, pages, tabs and trees", () => {
        const record = { code: null, kind: "principle", layer: null, name: "A", relations: [], summary: null };
        const plans = indexPlansOf({
            collections: new Map([["architecture", { "architecture:a": record }]]),
            discovery: DISCOVERY,
            files: [],
            groups: [FACET_GROUP],
            localPath: (path) => path,
            plans: sectionPlans(DISCOVERY, () => null),
            site: SITE,
        });
        expect(plans.collections.map((plan) => plan.identity.address.json)).toStrictEqual([
            "/json/api/records/architecture",
        ]);
        expect(plans.facets).toHaveLength(1);
        expect(plans.levels).toHaveLength(4);
        expect(plans.tabs.map((plan) => plan.identity.address.json)).toStrictEqual([
            "/json/api/pages/method/start",
            "/json/api/pages/method/build",
        ]);
        expect(plans.trees).toStrictEqual([]);
    });
});

describe("indexLeaves", () => {
    it("lists the entries a plan names, skips a ref with no entry and renders the Markdown index", () => {
        const plans = facetIndexPlans([{ ...FACET_GROUP, ids: ["a", "gone"] }]);
        const [leaf] = indexLeaves(plans, new Map([["architecture:a", entry("architecture:a", "a")]]), SITE);
        expect(leaf?.data).toMatchObject({ entries: [{ ref: "architecture:a" }] });
        expect(leaf?.markdown).toContain(`[a](${SITE}/json/a)`);
    });

    it("splits an index over the file budget into ordered parts that its head names, and marks the parts", () => {
        const ids = Array.from({ length: 900 }, (_unused, at) => `r${String(at).padStart(4, "0")}`);
        const long = "x".repeat(900);
        const entries = new Map(
            ids.map((id) => [`architecture:${id}`, { ...entry(`architecture:${id}`, id), summary: long }]),
        );
        const leaves = indexLeaves(facetIndexPlans([{ ...FACET_GROUP, ids }]), entries, SITE);
        const head = leaves.at(-1);
        const parts = leaves.slice(0, -1);
        expect(parts.length).toBeGreaterThan(1);
        expect(parts.every((part) => part.identity.kind === "index-part")).toBe(true);
        expect(parts[0]?.identity.address.json).toBe(`${head?.identity.address.json ?? ""}/_1`);
        expect(Reflect.get(head?.data ?? {}, "count")).toBe(900);
        expect(Reflect.get(head?.data ?? {}, "entries")).toBeUndefined();
        expect(head?.markdown).toContain("r0000 to ");
        expect(isIndexHead({ ...entry("x", "x"), kind: "index" })).toBe(true);
        expect(isIndexHead({ ...entry("y", "y"), kind: "index-part" })).toBe(false);
    });
});
