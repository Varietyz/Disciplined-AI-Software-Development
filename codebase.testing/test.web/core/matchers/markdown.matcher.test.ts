import {
    bodyLines,
    bulletText,
    cellsOf,
    headingLevel,
    isRule,
    isTableRule,
    orderedText,
} from "@banes-lab/web/core/matchers/markdown.matcher.ts";
import { describe, expect, it } from "vitest";

describe("line classification", () => {
    it("reads a heading level, a rule and the text of a bullet or ordered item", () => {
        expect(headingLevel("## Title")).toBe(2);
        expect(headingLevel("#hash")).toBe(0);
        expect(isRule("- - -")).toBe(true);
        expect(isRule("-- x")).toBe(false);
        expect(bulletText("  * item")).toBe("item");
        expect(bulletText("*emphasis*")).toBeNull();
        expect(orderedText("12. step")).toBe("step");
        expect(orderedText("12 step")).toBeNull();
    });

    it("splits a table row into cells and recognizes the rule under the header", () => {
        expect(cellsOf("| a | b |")).toStrictEqual(["a", "b"]);
        expect(isTableRule("| --- | :-: |")).toBe(true);
        expect(isTableRule("| a | b |")).toBe(false);
    });
});

describe("bodyLines", () => {
    it("drops comments and the frontmatter block", () => {
        expect(bodyLines("---\nname: x\n---\nbody<!-- note -->")).toStrictEqual(["body"]);
        expect(bodyLines("plain\ntext")).toStrictEqual(["plain", "text"]);
    });
});
