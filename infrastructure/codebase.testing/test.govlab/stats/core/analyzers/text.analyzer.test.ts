import { describe, expect, it } from "vitest";
import { countLines } from "@govlab/stats/core/analyzers/text.analyzer.ts";

describe("countLines", () => {
    it("reports nothing for an empty file", () => {
        expect(countLines("")).toEqual({ blank: 0, code: 0, total: 0 });
    });

    it("counts a single unterminated line", () => {
        expect(countLines("const a = 1;")).toEqual({ blank: 0, code: 1, total: 1 });
    });

    it("does not count the trailing newline as an extra line", () => {
        expect(countLines("a\nb\n")).toEqual({ blank: 0, code: 2, total: 2 });
    });

    it("separates blank lines from code", () => {
        expect(countLines("a\n\nb\n")).toEqual({ blank: 1, code: 2, total: 3 });
    });

    it("treats whitespace-only lines as blank", () => {
        expect(countLines("a\n   \n\t\nb")).toEqual({ blank: 2, code: 2, total: 4 });
    });

    it("handles carriage returns without inflating the count", () => {
        expect(countLines("a\r\nb\r\n")).toEqual({ blank: 0, code: 2, total: 2 });
    });
});
