import { describe, expect, it } from "vitest";
import { loadAnalyzers } from "@govlab/docs/core/loaders/code.loader.ts";

describe("loadAnalyzers", () => {
    it("discovers an analyzer per ecosystem from the plugins folder, sorted by ecosystem", async () => {
        const ecosystems = (await loadAnalyzers()).map((analyzer) => analyzer.ecosystem);
        expect(ecosystems).toContain("typescript");
        expect(ecosystems).toStrictEqual(ecosystems.toSorted((left, right) => left.localeCompare(right)));
    });
});
