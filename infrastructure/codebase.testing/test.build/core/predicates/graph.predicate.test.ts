import { describe, expect, it } from "vitest";
import { isChunkFile } from "@banes-lab/build-scripts/core/predicates/graph.predicate.ts";

describe("isChunkFile", () => {
    it("tells a chunk apart from the loader and from another family's chunk", () => {
        expect(isChunkFile("graph.chapter.generated.ts")).toBe(true);
        expect(isChunkFile("graph.generated.ts")).toBe(false);
        expect(isChunkFile("reference.chapter.generated.ts")).toBe(false);
    });
});
