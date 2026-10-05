import { describe, expect, it } from "vitest";
import { renderSearchAsset } from "@banes-lab/build-scripts/core/formatters/search.formatter.ts";

describe("renderSearchAsset", () => {
    it("writes a typed module whose one export parses back to the asset", () => {
        const asset = { definitions: [], positions: { evidence: {}, links: {}, route: { a: 1 } } };
        const source = renderSearchAsset(asset);
        expect(source.startsWith('import type { SearchAsset } from "#types/search.types";')).toBe(true);
        const start = source.indexOf("JSON.parse(") + "JSON.parse(".length;
        const literal: unknown = JSON.parse(source.slice(start, source.lastIndexOf(");")));
        const parsed: unknown = JSON.parse(String(literal));
        expect(parsed).toStrictEqual(asset);
    });
});
