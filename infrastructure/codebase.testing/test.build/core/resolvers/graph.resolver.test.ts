import { describe, expect, it } from "vitest";
import { chunkFileOf } from "@banes-lab/build-scripts/core/resolvers/graph.resolver.ts";

describe("chunkFileOf", () => {
    it("names a chunk's generated module by its key", () => {
        expect(chunkFileOf("chapter")).toBe("graph.chapter.generated.ts");
    });
});
