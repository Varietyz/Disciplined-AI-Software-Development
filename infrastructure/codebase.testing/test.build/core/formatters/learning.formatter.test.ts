import { describe, expect, it } from "vitest";
import type { Block } from "@banes-lab/build-scripts/types/learning.types.ts";
import { renderLearning } from "@banes-lab/build-scripts/core/formatters/learning.formatter.ts";

const BLOCKS: readonly Block[] = [{ code: "aa", label: "Start", owner: "page", stops: [] }];

describe("renderLearning", () => {
    it("writes the blocks as one typed module with each block's label", () => {
        const module = renderLearning(BLOCKS);
        expect(module).toContain("Start");
        expect(module).toContain("export const");
    });
});
