import { FACET_GROUP, SITE, entry } from "./index.fixture.ts";
import {
    collectionIndexPlans,
    facetIndexPlans,
    facetLevelPlans,
    levelIndexPlans,
} from "@banes-lab/build-scripts/core/converters/index.filter.converter.ts";
import { describe, expect, it } from "vitest";
import { indexLeaves } from "@banes-lab/build-scripts/core/converters/index.converter.ts";

describe("levelIndexPlans and facetLevelPlans", () => {
    it("lists the pages, collections, trees and facet collections one level above them", () => {
        const { collections, fields } = facetLevelPlans([FACET_GROUP]);
        expect(fields.map((plan) => [plan.identity.title, plan.refs])).toStrictEqual([
            ["Architecture principles by severity", ["api:facets/architecture/severity/mandatory"]],
        ]);
        expect(collections[0]?.identity).toMatchObject({
            ref: "api:facets/architecture",
            title: "Architecture principles by field",
        });
        const levels = levelIndexPlans({ collections: [], facets: collections, pages: [], trees: [] });
        expect(
            levels.map((plan) => [plan.identity.ref, plan.identity.address.json, plan.identity.title]),
        ).toStrictEqual([
            ["api:pages", "/json/api/pages", "Pages"],
            ["api:records", "/json/api/records", "Ontology collections"],
            ["api:source", "/json/api/source", "Source trees"],
            ["api:facets", "/json/api/facets", "Facets"],
        ]);
        expect(levels[3]?.refs).toStrictEqual(["api:facets/architecture"]);
    });
});

describe("facetIndexPlans and collectionIndexPlans", () => {
    it("indexes a facet's members and gives each collection the values its fields take", () => {
        const entries = new Map([["architecture:a", entry("architecture:a", "a")]]);
        const [facet] = indexLeaves(facetIndexPlans([FACET_GROUP]), entries, SITE);
        expect(facet?.identity.address.json).toBe("/json/api/facets/architecture/severity/mandatory");
        expect(facet?.identity.title).toBe("Architecture principles whose severity is mandatory");
        expect(facet?.data).toMatchObject({ entries: [{ ref: "architecture:a" }], value: "mandatory" });
        const [collection] = indexLeaves(
            collectionIndexPlans(new Map([["architecture", ["architecture:a"]]]), [FACET_GROUP], SITE),
            entries,
            SITE,
        );
        expect(collection?.identity).toMatchObject({ summary: "1 record", title: "Architecture principles" });
        expect(collection?.data).toMatchObject({
            collection: "architecture",
            facets: [{ count: 1, field: "severity", value: "mandatory" }],
        });
        expect(() => collectionIndexPlans(new Map([["unknown", []]]), [], SITE)).toThrow("unknown");
        expect(collection?.markdown).toContain(
            `\`severity\`: [mandatory](${SITE}/api/facets/architecture/severity/mandatory.md) (1)`,
        );
    });
});
