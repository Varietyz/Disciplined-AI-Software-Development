import { describe, expect, it } from "vitest";
import { rootRows, shardAddresses, shardRow } from "@banes-lab/deploy/core/converters/catalog.converter.ts";

const ENTRY = { bytes: 3, fingerprint: "f", json: "https://x.test/json/a", markdown: null, ref: null, title: null };

describe("rootRows", () => {
    it("takes the first entry of each list the root index carries and skips a malformed one", () => {
        const listed = { ...ENTRY, ref: "api:records/a", title: "A" };
        const root = { collections: [listed], pages: [{ json: "https://x.test/json/b" }], trees: [] };
        expect(rootRows(root)).toStrictEqual([listed]);
        expect(rootRows(null)).toStrictEqual([]);
    });
});

describe("shardAddresses and shardRow", () => {
    it("lists the shard addresses and reads a shard's first row by its declared columns", () => {
        expect(shardAddresses({ shards: [{ json: "https://x.test/json/api/ids/a" }, { group: "b" }] })).toStrictEqual([
            "https://x.test/json/api/ids/a",
        ]);
        const shard = {
            columns: ["json", "bytes", "fingerprint", "markdown"],
            rows: [["https://x.test/json/a", 3, "f", "https://x.test/a.md"]],
        };
        expect(shardRow(shard)).toStrictEqual({ ...ENTRY, markdown: "https://x.test/a.md" });
        expect(shardRow({ columns: [], rows: [] })).toBeNull();
    });
});
