import { collapseBreaks, collapseSpaces, joinParts } from "@banes-lab/web/core/normalizers/text.normalizer.ts";
import { describe, expect, it } from "vitest";

describe("joinParts", () => {
    it("spaces two words that would otherwise touch, and two adjacent elements, and nothing else", () => {
        expect(
            joinParts([
                { element: false, text: "one" },
                { element: false, text: "two" },
            ]),
        ).toBe("one two");
        expect(
            joinParts([
                { element: false, text: "one" },
                { element: false, text: "." },
            ]),
        ).toBe("one.");
        expect(
            joinParts([
                { element: true, text: "(a)" },
                { element: true, text: "(b)" },
            ]),
        ).toBe("(a) (b)");
        expect(
            joinParts([
                { element: false, text: "one " },
                { element: false, text: "" },
                { element: false, text: "two" },
            ]),
        ).toBe("one two");
    });
});

describe("collapseSpaces", () => {
    it("folds every run of whitespace into one space and keeps a trailing one", () => {
        expect(collapseSpaces("a \n\t b ")).toBe("a b ");
        expect(collapseSpaces("plain")).toBe("plain");
    });
});

describe("collapseBreaks", () => {
    it("keeps at most one blank line, drops a space before a break and after one, and trims", () => {
        expect(collapseBreaks("\n a \n\n\n\n b \n")).toBe("a\n\nb");
        expect(collapseBreaks("x \ny")).toBe("x\ny");
    });

    it("keeps every line inside a code fence as it is, indentation and blank lines included", () => {
        const fence = "```yaml\nroot:\n    child: 1\n\n\n    other: 2\n```";
        expect(collapseBreaks(` text \n\n\n${fence}\n\n\n after`)).toBe(`text\n\n${fence}\n\nafter`);
    });
});
