import { addressLines, blocks, fenced } from "@banes-lab/build-scripts/core/formatters/markdown.formatter.ts";
import { describe, expect, it } from "vitest";

describe("addressLines and blocks", () => {
    it("drops an empty field and an empty block and joins the rest", () => {
        expect(
            addressLines([
                ["Kind", "x"],
                ["Layer", null],
            ]),
        ).toBe("Kind: x");
        expect(blocks(["# T", null, "", "body"])).toBe("# T\n\nbody\n");
    });
});

describe("fenced", () => {
    it("fences source with a run of backticks longer than any it holds", () => {
        expect(fenced("a ``` b", "md")).toBe("````md\na ``` b\n````");
        expect(fenced("plain", "ts")).toBe("```ts\nplain\n```");
    });
});
