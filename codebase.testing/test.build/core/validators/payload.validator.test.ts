import {
    checkMarkdown,
    checkPayload,
    inlineMarkupIn,
} from "@banes-lab/build-scripts/core/validators/payload.validator.ts";
import { describe, expect, it } from "vitest";

const ADDRESS = "https://example.test/terms";
const PAYLOAD_FILE = "json/terms.json";
const MARKDOWN_FILE = "terms.md";

describe("inlineMarkupIn", () => {
    it("names the first inline html tag found in any string of a nested value, and nothing for markdown marks", () => {
        expect(inlineMarkupIn({ a: ["plain", { b: "x <strong>y</strong>" }] })).toBe("strong");
        expect(inlineMarkupIn("<a href='/x'>link</a>")).toBe("a");
        expect(inlineMarkupIn({ a: "**y** `z` <phase> a < b" })).toBeNull();
    });
});

describe("checkPayload", () => {
    it("accepts a payload carrying the page id, its tab and markdown-only content, and reports anything else", () => {
        const clean = JSON.stringify({ content: { text: "**bold**" }, id: "terms", tab: null });
        expect(checkPayload(PAYLOAD_FILE, "terms", null, clean)).toStrictEqual([]);
        const tabbed = JSON.stringify({ content: { id: "guide" }, id: "terms", tab: "guide" });
        expect(checkPayload(PAYLOAD_FILE, "terms", "guide", tabbed)).toStrictEqual([]);
        expect(checkPayload(PAYLOAD_FILE, "terms", null, tabbed)).toHaveLength(1);
        expect(checkPayload(PAYLOAD_FILE, "terms", null, JSON.stringify({ content: {}, id: "home" }))).toHaveLength(2);
        expect(checkPayload(PAYLOAD_FILE, "terms", null, JSON.stringify({ id: "terms" }))).toHaveLength(1);
        const html = JSON.stringify({ content: { text: "<em>x</em>" }, id: "terms", tab: null });
        expect(checkPayload(PAYLOAD_FILE, "terms", null, html)).toHaveLength(1);
    });
});

describe("checkMarkdown", () => {
    it("wants the title first, the canonical address named and a body beneath the head", () => {
        const twin = `# Terms\n\n> The terms.\n\nCanonical: ${ADDRESS}\n\nBody.\n`;
        expect(checkMarkdown(MARKDOWN_FILE, twin, "Terms", ADDRESS)).toStrictEqual([]);
        expect(checkMarkdown(MARKDOWN_FILE, "# Other\n", "Terms", ADDRESS)).toHaveLength(3);
    });
});
