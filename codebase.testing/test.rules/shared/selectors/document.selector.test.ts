import { describe, expect, it } from "vitest";
import { jsonTexts, markdownTexts, withoutCode } from "@ssot/govlab/shared/selectors/document.selector.ts";

const MARKDOWN = [
    "---",
    "name: probe",
    "---",
    "",
    "# Title",
    "",
    "```ts",
    "const x = 1;",
    "```",
    "| a | b |",
    "| --- | --- |",
    "Run `npm test` now.",
].join("\n");

describe("withoutCode", () => {
    it("replaces a code span with a placeholder word", () => {
        expect(withoutCode("Run `npm test` now.")).toBe("Run code now.");
    });
});

describe("markdownTexts", () => {
    it("skips the frontmatter, fenced code and table rule rows, and keeps each line's location", () => {
        const texts = markdownTexts("a.md", MARKDOWN);
        expect(texts.map((text) => text.text)).toStrictEqual(["# Title", "a", "b", "Run code now."]);
        expect(texts[0]?.at).toBe("a.md:5");
    });
});

describe("jsonTexts", () => {
    it("reads every prose string by its pointer and skips code fields", () => {
        const texts = jsonTexts("m.json", { code: "run it now", docs: ["one two", "x"] });
        expect(texts).toStrictEqual([{ at: "m.json#/docs/0", text: "one two" }]);
    });

    it("skips the lines of a fenced sample inside a prose string, as a document does", () => {
        const value = { shape: "The record reads as follows.\n```text\nAgent X — ACTIVE; INACTIVE\n```" };
        expect(jsonTexts("m", value).map((entry) => entry.text)).toStrictEqual(["The record reads as follows."]);
    });
});
