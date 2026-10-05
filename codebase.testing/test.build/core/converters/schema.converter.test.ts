import { describe, expect, it } from "vitest";
import {
    inferSchema,
    inferredKindOf,
    samplesOf,
    schemaLeaves,
    typeOf,
} from "@banes-lab/build-scripts/core/converters/schema.converter.ts";

describe("typeOf", () => {
    it("names a value by its JSON Schema type, telling an integer from a number and an array from an object", () => {
        expect([null, [], 1, 1.5, "a", true, {}].map(typeOf)).toStrictEqual([
            "null",
            "array",
            "integer",
            "number",
            "string",
            "boolean",
            "object",
        ]);
    });
});

describe("inferredKindOf", () => {
    it("names the kind of a JSON address, and no kind for a schema or an address outside the JSON route", () => {
        expect(inferredKindOf("/json/records/architecture/dry")).toBe("record");
        expect(inferredKindOf("/json/api/schema/record")).toBeNull();
        expect(inferredKindOf("/api/records.md")).toBeNull();
    });
});

const SITE = "https://example.test";

describe("inferSchema", () => {
    it("names every type a value takes, and marks a field required only where every sample carries it", () => {
        const schema = inferSchema([
            { count: 2, rows: [["a", 1]], title: "A" },
            { count: 2.5, title: null },
        ]);
        expect(schema.type).toBe("object");
        expect(schema.required).toStrictEqual(["count", "title"]);
        expect(schema.properties?.["count"]?.type).toBe("number");
        expect(schema.properties?.["title"]?.type).toStrictEqual(["null", "string"]);
        expect(schema.properties?.["rows"]?.items?.items?.type).toStrictEqual(["integer", "string"]);
    });

    it("describes an object keyed by data, such as a word map, by the shape of its values", () => {
        const postings = Object.fromEntries(Array.from({ length: 40 }, (_unused, at) => [`w${String(at)}`, [[at, 1]]]));
        const schema = inferSchema([postings]);
        expect(schema.properties).toBeUndefined();
        expect(schema.additionalProperties?.type).toBe("array");
    });
});

describe("samplesOf and schemaLeaves", () => {
    it("groups every JSON file and draft by the grammar row it matches, and writes one schema per kind", () => {
        const files = new Map([
            ["/json/records/architecture/dry", JSON.stringify({ ref: "architecture:dry", title: "DRY" })],
            ["/json/api/schema/record", JSON.stringify({ type: "object" })],
            ["/records/architecture/dry.md", "# DRY\n"],
            ["/json/api/records/lexicon/_2", JSON.stringify({ entries: [], part: 2 })],
        ]);
        const draft = {
            data: { count: 0, ref: "api:ids", shards: [] },
            identity: {
                address: { json: "/json/api/ids", markdown: null },
                href: null,
                kind: "index",
                ref: "api:ids",
                summary: null,
                title: "Ids",
            },
            markdown: null,
        };
        const samples = samplesOf(files, [draft]);
        expect([...samples.keys()].toSorted()).toStrictEqual(["ids", "part", "record"]);
        const leaves = schemaLeaves(samples, SITE);
        const record = leaves.find((leaf) => leaf.identity.ref === "api:schema/record");
        expect(record?.identity.address.json).toBe("/json/api/schema/record");
        expect(record?.data).toMatchObject({
            $id: `${SITE}/json/api/schema/record`,
            required: ["ref", "title"],
            type: "object",
        });
    });

    it("stops on a JSON file that matches no row of the address grammar", () => {
        expect(() => samplesOf(new Map([["/json/a/b/c/d/e", "{}"]]), [])).toThrow("matches no row");
    });
});
