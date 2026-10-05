import { describe, expect, it } from "vitest";
import { isProsePath, nextToken, pathSpans, trimEdges } from "@govlab/docs/core/selectors/markdown.selector.ts";

describe("trimEdges and isProsePath", () => {
    it("trim surrounding punctuation and a sentence full stop, keeping a double dot", () => {
        expect(trimEdges("(src/a.ts),")).toBe("src/a.ts");
        expect(trimEdges("src/a.ts.")).toBe("src/a.ts");
        expect(trimEdges("(src/a.ts).")).toBe("src/a.ts");
        expect(trimEdges("etc..")).toBe("etc..");
    });

    it("accept relative paths and paths with a known extension, and refuse URLs and packages", () => {
        expect(["./x", "src/a.ts", "https://x.dev/a.ts", "@scope/pkg/a.ts", "and/or"].map(isProsePath)).toStrictEqual([
            true,
            true,
            false,
            false,
            false,
        ]);
    });
});

describe("nextToken and pathSpans", () => {
    it("step over inline space and locate each path span in prose", () => {
        expect(nextToken("  word next", 0)).toStrictEqual({ next: 6, start: 2 });
        const prose = "Edit src/a.ts and (docs/b.md).";
        expect(pathSpans(prose).map(([start, end]) => prose.slice(start, end))).toStrictEqual([
            "src/a.ts",
            "docs/b.md",
        ]);
    });
});
