import { describe, expect, it } from "vitest";
import { indentOf, lineEdit, outputLines, outputRest } from "@banes-lab/web/core/converters/surface.converter.ts";

const line = function line(text: string): { changed: boolean; text: string } {
    return { changed: false, text };
};

describe("lineEdit", () => {
    it("names where the lines differ, how many are removed and which are typed in", () => {
        expect(lineEdit(["a", "b", "c"], [line("a"), line("x"), line("y"), line("c")])).toStrictEqual({
            at: 1,
            inserted: [line("x"), line("y")],
            removed: 1,
        });
        expect(lineEdit(["a"], [line("a")])).toStrictEqual({ at: 1, inserted: [], removed: 0 });
    });
});

describe("indentOf, outputRest and outputLines", () => {
    it("counts leading blanks, continues output already shown, and splits output without a trailing empty line", () => {
        expect(indentOf("    status")).toBe(4);
        expect(indentOf("status")).toBe(0);
        expect(outputRest("waiting\n", "waiting\nCHANGED\n")).toBe("CHANGED\n");
        expect(outputRest("waiting", "other")).toBeNull();
        expect(outputRest("", "anything")).toBeNull();
        expect(outputRest(undefined, "anything")).toBeNull();
        expect(outputLines("a\nb\n")).toStrictEqual(["a", "b"]);
        expect(outputLines("a")).toStrictEqual(["a"]);
    });
});
