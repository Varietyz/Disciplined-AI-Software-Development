import { describe, expect, it } from "vitest";
import { DISCOVERY } from "../converters/site.fixture.ts";
import { closeCatalog } from "@banes-lab/build-scripts/core/coordinators/catalog.index.coordinator.ts";
import { createStore } from "@banes-lab/build-scripts/core/stores/catalog.store.ts";
import { instanceDefects } from "@banes-lab/build-scripts/core/validators/schema.validator.ts";
import { isObjectValue } from "@banes-lab/build-scripts/core/converters/schema.converter.ts";
import { renderDataLeaf } from "@banes-lab/build-scripts/core/formatters/data.formatter.ts";

const fieldOf = function fieldOf(value: unknown, key: string): unknown {
    return typeof value === "object" && value !== null ? Reflect.get(value, key) : undefined;
};

const EMPTY_PLANS = {
    collections: [],
    facetCollections: [],
    facetFields: [],
    facets: [],
    folders: [],
    levels: [],
    pages: [],
    tabs: [],
    trees: [],
};

describe("closeCatalog", () => {
    it("writes a schema for every kind it publishes, then the id manifest and the root that names them", () => {
        const store = createStore(DISCOVERY.site, renderDataLeaf);
        store.add([
            {
                data: { ref: "architecture:dry", title: "DRY" },
                identity: {
                    address: { json: "/json/records/architecture/dry", markdown: null },
                    href: null,
                    kind: "principle",
                    ref: "architecture:dry",
                    summary: null,
                    title: "DRY",
                },
                markdown: null,
            },
        ]);
        const journal = closeCatalog(store, {
            discovery: DISCOVERY,
            indexes: EMPTY_PLANS,
            journal: {
                moved: {},
                refs: { "architecture:gone": { fingerprint: "f", json: "/json/x", kind: "k", title: "T" } },
            },
            queries: [],
        });
        expect(Object.keys(journal.refs)).toContain("architecture:dry");
        expect(journal.moved).toStrictEqual({ "architecture:gone": { json: "/json/x", to: null } });
        const addresses = [...store.files.keys()];
        expect(addresses).toContain("/json/api/moved");
        expect(addresses).toContain("/json/api/schema/record");
        expect(addresses).toContain("/json/api/schema/ids");
        expect(addresses).toContain("/json/api/schema/site");
        expect(addresses).toContain("/json/api/ids");
        expect(addresses).toContain("/api/ids.md");
        expect(addresses).toContain("/api/moved.md");
        expect(addresses).toContain("/api/schema/record.md");
        const root: unknown = JSON.parse(store.files.get("/json/api") ?? "{}");
        const grammar = fieldOf(root, "grammar");
        const record: unknown = Array.isArray(grammar)
            ? grammar.find((row: unknown) => fieldOf(row, "kind") === "record")
            : undefined;
        expect(fieldOf(record, "schema")).toBe("/json/api/schema/record");
        expect(addresses).not.toContain("/json/api/schema/schema");
        const siteSchema: unknown = JSON.parse(store.files.get("/json/api/schema/site") ?? "{}");
        expect(isObjectValue(siteSchema) ? instanceDefects(root, siteSchema, "$") : ["no schema"]).toStrictEqual([]);
    });
});
