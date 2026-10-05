import {
    columnValues,
    rowsOf,
    shardFilesOf,
    stringsIn,
} from "@banes-lab/build-scripts/core/selectors/catalog.selector.ts";
import { describe, expect, it } from "vitest";

const SITE = "https://example.test";

describe("stringsIn", () => {
    it("collects every string at any depth of a parsed value", () => {
        expect(stringsIn({ a: "x", b: [1, "y", { c: "z" }], d: null })).toStrictEqual(["x", "y", "z"]);
    });
});

describe("rowsOf", () => {
    it("reads the manifest rows by their column names, and nothing from a file without columns", () => {
        const raw = JSON.stringify({
            columns: ["ref", "json", "markdown", "bytes", "fingerprint"],
            rows: [["api:x", "/json/x", null, 12, "f"], "not a row"],
        });
        expect(rowsOf(raw)).toStrictEqual([
            { bytes: 12, fingerprint: "f", json: "/json/x", markdown: null, ref: "api:x" },
        ]);
        expect(rowsOf("{}")).toStrictEqual([]);
    });
});

describe("columnValues", () => {
    it("reads one column of every row, and nothing for a column the file does not declare", () => {
        const raw = JSON.stringify({ columns: ["ref", "to"], rows: [["a", "/x"], ["b", null], "not a row"] });
        expect(columnValues(raw, "to")).toStrictEqual(["/x", null]);
        expect(columnValues(raw, "json")).toStrictEqual([]);
        expect(columnValues("{}", "to")).toStrictEqual([]);
    });
});

describe("shardFilesOf", () => {
    it("maps each shard a head names to the file that serves it", () => {
        const raw = JSON.stringify({ shards: [{ json: `${SITE}/json/api/ids/lexicon/_2` }, { count: 1 }] });
        expect(shardFilesOf(raw, SITE)).toStrictEqual(["json/api/ids/lexicon/_2.json"]);
        expect(shardFilesOf("{}", SITE)).toStrictEqual([]);
    });
});
