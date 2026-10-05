import { describe, expect, it } from "vitest";
import { renderGraphChunk, renderGraphLoader } from "@banes-lab/build-scripts/core/formatters/graph.formatter.ts";

describe("renderGraphLoader", () => {
    it("writes a loader that imports each chunk lazily", () => {
        expect(renderGraphLoader(["chapter"])).toContain('import("#core/generated/graph.chapter.generated")');
    });
});

describe("renderGraphChunk", () => {
    it("writes a typed module whose one export parses back to the chunk", () => {
        const chunk = { "architecture:x": { kind: "principle", number: null, relations: [], title: "X" } };
        const source = renderGraphChunk(chunk);
        expect(source.startsWith('import type { GraphChunk } from "#types/graph.types";')).toBe(true);
        const start = source.indexOf("JSON.parse(") + "JSON.parse(".length;
        const literal: unknown = JSON.parse(source.slice(start, source.lastIndexOf(");")));
        const parsed: unknown = JSON.parse(String(literal));
        expect(parsed).toStrictEqual(chunk);
    });
});
