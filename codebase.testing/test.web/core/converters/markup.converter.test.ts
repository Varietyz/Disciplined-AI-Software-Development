import { convertMarkup, markdownOf, summarizeMarkup } from "@banes-lab/web/core/converters/markup.converter.ts";
import { describe, expect, it } from "vitest";
import { SUMMARY_LENGTH } from "@banes-lab/web/configuration/constants/document.constants.ts";

const FALLBACK = "Fallback description.";
const MARKUP = "<strong>Pattern Abstract Grammar</strong> is a   structured instruction format for <em>LLMs</em>.";
const LONG = "word ".repeat(60).trim();

describe("convertMarkup", () => {
    it("splits inline tags into typed runs", () => {
        const runs = convertMarkup("plain <strong>bold</strong> and <code>x</code>");
        expect(runs.map((run) => run.kind)).toStrictEqual(["text", "strong", "text", "code"]);
        expect(runs[1]?.text).toBe("bold");
    });

    it("keeps the href of a link run", () => {
        const runs = convertMarkup('<a href="/grammar">go</a>');
        expect(runs[0]?.kind).toBe("link");
        expect(runs[0]?.href).toBe("/grammar");
    });

    it("emits a break run for <br>", () => {
        expect(convertMarkup("a<br>b").map((run) => run.kind)).toStrictEqual(["text", "break", "text"]);
    });

    it("decodes entities and leaves unknown tags as text", () => {
        const runs = convertMarkup("&lt;x&gt; <weird>y</weird>");
        expect(runs[0]?.text).toBe("<x> ");
        expect(runs.some((run) => run.text.includes("<weird>"))).toBe(true);
    });

    it("keeps the enclosing emphasis on a link and on the text after it", () => {
        const runs = convertMarkup('<em>one <a href="/x">two</a> three</em> four');
        expect(runs.map((run) => [run.kind, run.emphasis === true])).toStrictEqual([
            ["emphasis", false],
            ["link", true],
            ["emphasis", false],
            ["text", false],
        ]);
    });

    it("does not mutate runs between calls", () => {
        const first = convertMarkup("one");
        convertMarkup("two");
        expect(first).toHaveLength(1);
    });
});

describe("summarizeMarkup", () => {
    it("strips inline markup and collapses whitespace", () => {
        expect(summarizeMarkup(MARKUP, FALLBACK)).toBe(
            "Pattern Abstract Grammar is a structured instruction format for LLMs.",
        );
    });

    it("cuts at a word boundary within the summary length and marks the cut", () => {
        const summary = summarizeMarkup(LONG, FALLBACK);
        expect(summary.length).toBeLessThanOrEqual(SUMMARY_LENGTH + 1);
        expect(summary.endsWith("…")).toBe(true);
        expect(summary.includes("wor…")).toBe(false);
    });

    it("ends on the last whole sentence that fits rather than cutting a sentence off", () => {
        const first = "The first sentence fits. ";
        const summary = summarizeMarkup(first + LONG, FALLBACK);
        expect(summary).toBe(first.trim());
    });

    it("falls back when the markup carries no text", () => {
        expect(summarizeMarkup("", FALLBACK)).toBe(FALLBACK);
    });
});

describe("markdownOf", () => {
    it("rewrites inline tags as markdown marks and links, keeps plain text and unknown tags verbatim", () => {
        expect(markdownOf('<strong>a</strong> <em>b</em> <code>c</code> <a href="/x">d</a>')).toBe(
            "**a** *b* `c` [d](/x)",
        );
        expect(markdownOf("one<br>two")).toBe("one\ntwo");
        expect(markdownOf("plain <phase> &lt;x&gt;")).toBe("plain <phase> <x>");
    });

    it("wraps a link inside emphasis in one emphasis span, with whitespace outside the marks", () => {
        expect(markdownOf('With it: <em>one limit with <a href="/x">one home</a>; not in scope</em>.')).toBe(
            "With it: *one limit with [one home](/x); not in scope*.",
        );
    });
});
