import { describe, expect, it } from "vitest";
import { searchAssetOf } from "@banes-lab/build-scripts/core/loaders/search.loader.ts";

describe("searchAssetOf", () => {
    it("is the step the graph build runs through the web member's module runner", () => {
        expect(typeof searchAssetOf).toBe("function");
    });
});
