import { describe, expect, it } from "vitest";
import { lengthBroken, lengthHeld } from "@project/scripts/configuration/strings/source.strings.ts";
import { lengthVerdict, nonBlankLines } from "@project/scripts/core/validators/source.validator.ts";

describe("nonBlankLines", () => {
    it("counts only the lines that carry text", () => {
        expect(nonBlankLines("a\n\n  \nb\n")).toBe(2);
    });
});

describe("lengthVerdict", () => {
    it("holds with nothing over the cap, and lists the longest file first otherwise", () => {
        expect(lengthVerdict([], 200, 5)).toStrictEqual({ held: true, text: lengthHeld(200, 5) });
        const verdict = lengthVerdict(
            [
                { count: 210, file: "a.css" },
                { count: 250, file: "b.html" },
            ],
            200,
            5,
        );
        expect(verdict.held).toBe(false);
        expect(verdict.text).toBe(lengthBroken(200, ["   250  b.html", "   210  a.css"]));
    });
});
