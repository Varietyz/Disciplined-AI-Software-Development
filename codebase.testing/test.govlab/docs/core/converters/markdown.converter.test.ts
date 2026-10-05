import { backtickBarePaths, blankMarkup, stripInlineCode } from "@govlab/docs/core/converters/markdown.converter.ts";
import { describe, expect, it } from "vitest";

const blank = function blank(text: string): string {
    return " ".repeat(text.length);
};

describe("stripInlineCode and blankMarkup", () => {
    it("blank code spans and link targets while keeping every offset", () => {
        expect(stripInlineCode("run `a/b.ts` now")).toBe(`run ${blank("`a/b.ts`")} now`);
        expect(stripInlineCode("``x `y` z`` end")).toBe(`${blank("``x `y` z``")} end`);
        expect(blankMarkup("see [a](src/a.ts) and `b`")).toBe(`see [a${blank("](src/a.ts)")} and ${blank("`b`")}`);
    });
});

describe("backtickBarePaths", () => {
    it("wraps bare paths in prose and leaves frontmatter, code and existing spans alone", () => {
        const source = [
            "---",
            "governs: src/a.ts",
            "---",
            "Edit src/a.ts and `src/b.ts`.",
            "```",
            "src/c.ts",
            "```",
        ].join("\n");
        expect(backtickBarePaths(source).split("\n")).toStrictEqual([
            "---",
            "governs: src/a.ts",
            "---",
            "Edit `src/a.ts` and `src/b.ts`.",
            "```",
            "src/c.ts",
            "```",
        ]);
    });
});
