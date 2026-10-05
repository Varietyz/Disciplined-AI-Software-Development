import {
    catalogWriter,
    productFile,
    readKnobs,
    writeKnobs,
    writeProduct,
} from "@govlab/quality/core/persistence/catalog.persistence.ts";
import { describe, expect, it } from "vitest";
import type { CatalogWriter } from "@govlab/quality/types/catalog.types.ts";

const recordingWriter = function recordingWriter(): { calls: [string, unknown][]; writer: CatalogWriter } {
    const calls: [string, unknown][] = [];
    const record = async (file: string, data: unknown): Promise<void> => {
        await Promise.resolve();
        calls.push([file, data]);
    };
    return { calls, writer: { json: record, markdown: record, text: record } };
};

describe("catalog persistence", () => {
    it("builds a writer with one method per output kind", async () => {
        const writer = await catalogWriter();
        expect([typeof writer.json, typeof writer.markdown, typeof writer.text]).toStrictEqual([
            "function",
            "function",
            "function",
        ]);
    });

    it("writes a product to its own file with its rules sorted by id", async () => {
        const { calls, writer } = recordingWriter();
        await writeProduct(writer, { rules: [{ ruleId: "b" }, { ruleId: "a" }], source: "demo", summary: {} });
        expect(calls[0]?.[0]).toBe(productFile("demo"));
        expect(calls[0]?.[1]).toStrictEqual({ rules: [{ ruleId: "a" }, { ruleId: "b" }], summary: {} });
    });

    it("merges refreshed knobs over the stored ones, keyed in order", async () => {
        const { calls, writer } = recordingWriter();
        await writeKnobs(writer, new Map([["zz-probe", []]]));
        const written = calls[0]?.[1];
        const keys = Object.keys(typeof written === "object" && written !== null ? written : {});
        expect(keys).toContain("zz-probe");
        expect(keys).toStrictEqual(keys.toSorted((a, b) => a.localeCompare(b, "en")));
        expect(Object.keys(readKnobs())).not.toContain("zz-probe");
    });
});
