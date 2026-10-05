import {
    NO_FENCE,
    bodyStart,
    codeLineMask,
    proseLines,
    splitLines,
    stepFence,
} from "@govlab/docs/core/parsers/markdown.parser.ts";
import { describe, expect, it } from "vitest";

describe("splitLines and bodyStart", () => {
    it("split on line feeds without carriage returns and skip a frontmatter block", () => {
        expect(splitLines("a\r\nb")).toStrictEqual(["a", "b"]);
        expect(bodyStart(["---", "name: x", "---", "# T"])).toBe(3);
        expect(bodyStart(["# T"])).toBe(0);
    });
});

describe("stepFence", () => {
    it("opens on a fence run and closes only on a bare run of the same character and length", () => {
        const open = stepFence("````ts", NO_FENCE);
        expect(open).toStrictEqual({ char: "`", len: 4, open: true });
        expect(stepFence("```", open)).toBe(open);
        expect(stepFence("````", open)).toBe(NO_FENCE);
        expect(stepFence("text", NO_FENCE)).toBe(NO_FENCE);
    });
});

describe("codeLineMask and proseLines", () => {
    it("mark fenced and indented code lines, and keep list continuations as prose", () => {
        const lines = ["text", "```", "code", "```", "", "    indented", "- item", "    continued"];
        expect(codeLineMask(lines, 0)).toStrictEqual([false, true, true, true, false, true, false, false]);
        expect(proseLines("---\nname: x\n---\nprose\n```\ncode\n```").map((entry) => entry.lineNo)).toStrictEqual([4]);
    });
});
