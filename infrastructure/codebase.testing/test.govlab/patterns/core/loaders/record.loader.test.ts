import { describe, expect, it } from "vitest";
import { discoverSources, loadRecords, streamJsonlFile } from "@govlab/patterns/core/loaders/record.loader.ts";
import { DataLoadError } from "@govlab/patterns/core/classifiers/schema.classifier.ts";
import { join } from "node:path";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const TWO = 2;
const THREE = 3;
const dir = mkdtempSync(join(tmpdir(), "pl-loaders-"));

const write = function write(name: string, content: string): string {
    const file = join(dir, name);
    writeVerbatim(file, content);
    return file;
};

describe("loadRecords", () => {
    it("loads a JSON array file and recovers its float fields", () => {
        const { records, floatFields } = loadRecords(write("array.json", '[{"x": 1.0, "y": 2}, {"x": 3.5, "y": 4}]'));
        expect(records).toHaveLength(TWO);
        expect([...floatFields]).toStrictEqual(["x"]);
    });

    it("loads the first array of an object file", () => {
        const { records, floatFields } = loadRecords(write("object.json", '{"rows": [{"x": 1.0, "y": 2}]}'));
        expect(records).toHaveLength(1);
        expect(floatFields.has("x")).toBe(true);
    });

    it("loads a multi-record JSONL file", () => {
        const { records } = loadRecords(write("data.jsonl", '{"x": 1.0, "y": 2}\n{"x": 3.5, "y": 4}\n'));
        expect(records).toHaveLength(TWO);
    });

    it("refuses a document with no records array", () => {
        expect(() => loadRecords(write("bare.json", '{"a": 1}'))).toThrow(DataLoadError);
    });

    it("discovers and merges every json and jsonl source in a folder", () => {
        const sub = mkdtempSync(join(tmpdir(), "pl-sources-"));
        writeVerbatim(join(sub, "a.json"), '[{"x": 1.0}]');
        writeVerbatim(join(sub, "b.jsonl"), '{"x": 2.5}\n{"x": 3}\n');
        writeVerbatim(join(sub, "ignore.txt"), "noise");
        expect(discoverSources(sub)).toHaveLength(TWO);
        expect(loadRecords(sub).records).toHaveLength(THREE);
    });
});

describe("streamJsonlFile", () => {
    it("yields one parsed record per non-blank line", async () => {
        const file = write("stream.jsonl", '{"a": 1}\n\n{"a": 2}\n');
        const seen: unknown[] = [];
        for await (const record of streamJsonlFile(file)) {
            seen.push(record);
        }
        expect(seen).toStrictEqual([{ a: 1 }, { a: 2 }]);
    });
});
