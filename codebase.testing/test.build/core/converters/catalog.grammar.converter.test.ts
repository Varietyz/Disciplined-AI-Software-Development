import {
    GRAMMAR,
    grammarRows,
    kindOfAddress,
    kindOrNull,
    matchesTemplate,
} from "@banes-lab/build-scripts/core/converters/catalog.grammar.converter.ts";
import { describe, expect, it } from "vitest";

describe("grammarRows", () => {
    it("publishes every level of the grammar with its kind, an example and the schema each served kind has", () => {
        const published = [
            "/json/api",
            "/json/records/architecture/dry",
            "/json/source/web/core/x.ts",
            "/json/api/schema/record",
        ];
        const rows = grammarRows(published);
        expect(rows).toHaveLength(GRAMMAR.length);
        const parts = GRAMMAR.filter((row) => row.kind === "part");
        expect(parts).toHaveLength(2);
        expect(new Set(GRAMMAR.map((row) => row.kind)).size).toBe(GRAMMAR.length - 1);
        expect(rows.find((row) => row.json === "/json/api")).toMatchObject({
            example: null,
            kind: "site",
            markdown: "/api.md",
            schema: null,
            template: false,
        });
        expect(rows.find((row) => row.json === "/json/records/{collection}/{id}")).toMatchObject({
            example: "/json/records/architecture/dry",
            kind: "record",
            schema: "/json/api/schema/record",
            template: true,
        });
        expect(rows.find((row) => row.kind === "source")?.example).toBe("/json/source/web/core/x.ts");
        expect(rows.find((row) => row.kind === "contact")?.example).toBeNull();
        expect(rows.find((row) => row.kind === "schema")?.schema).toBe("https://json-schema.org/draft/2020-12/schema");
    });
});

describe("matchesTemplate", () => {
    it("matches a published address to a grammar template, spanning placeholders across several segments", () => {
        expect(matchesTemplate("/json/records/{collection}/{id}", "/json/records/architecture/dry")).toBe(true);
        expect(matchesTemplate("/json/records/{collection}/{id}", "/json/records/architecture")).toBe(false);
        expect(matchesTemplate("/json/source/{tree}/{path}", "/json/source/web/core/converters/x.ts")).toBe(true);
        expect(matchesTemplate("/source/{tree}/{path}.txt", "/source/web/core/x.ts.txt")).toBe(true);
        expect(matchesTemplate("/source/{tree}/{path}.txt", "/source/web/core/x.ts.md")).toBe(false);
        expect(matchesTemplate("/json/api/records/{collection}/_{part}", "/json/api/records/lexicon/_2")).toBe(true);
        expect(matchesTemplate("/json/api/records/{collection}/_{part}", "/json/api/records/lexicon/a")).toBe(false);
    });
});

describe("kindOfAddress", () => {
    it("picks the most specific row, keeps an id shard's parts as shards, and names other index parts", () => {
        expect(kindOfAddress("/json/api/ids/lexicon")).toBe("idsShard");
        expect(kindOfAddress("/json/api/ids/lexicon/_2")).toBe("idsShard");
        expect(kindOfAddress("/json/api/records/lexicon/_2")).toBe("part");
        expect(kindOfAddress("/json/api/facets/lexicon/kind/_3")).toBe("part");
        expect(kindOfAddress("/json/api/route")).toBe("route");
        expect(kindOfAddress("/json/methodology/start/the-loop")).toBe("section");
        expect(kindOfAddress("/json/faq/why")).toBe("documentSection");
        expect(kindOfAddress("/json/records/algorithms/verify/closure")).toBe("closure");
        expect(kindOfAddress("/json/source/web/core/converters/x.ts")).toBe("source");
        expect(() => kindOfAddress("/nowhere")).toThrow("/nowhere");
        expect(kindOrNull("/nowhere")).toBeNull();
        expect(kindOrNull("/json/api/moved")).toBe("moved");
    });
});
