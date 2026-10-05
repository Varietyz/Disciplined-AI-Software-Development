import type { Attribute, Tag } from "@banes-lab/build-scripts/types/markup.types.ts";
import {
    decodeEntities,
    nextQuote,
    parseTag,
    serializeTag,
    tagEnd,
} from "@banes-lab/build-scripts/core/converters/markup.converter.ts";
import { describe, expect, it } from "vitest";

const CONTENT = `g class="node" data-id='a>b' hidden width=12/`;

describe("decodeEntities", () => {
    it("decodes the five markup entities and leaves anything else untouched", () => {
        expect(decodeEntities("&lt;a&gt; &amp; &quot;b&quot; &apos;c&apos; &copy; & x")).toBe(
            "<a> & \"b\" 'c' &copy; & x",
        );
    });
});

describe("nextQuote and tagEnd", () => {
    it("tracks the open quote and finds the closing bracket outside quotes", () => {
        expect(nextQuote("", '"')).toBe('"');
        expect(nextQuote('"', "'")).toBe('"');
        expect(nextQuote('"', '"')).toBe("");
        expect(nextQuote("", "x")).toBe("");
        expect(tagEnd(`<a b='>' c=">">tail`, 1)).toBe(14);
        expect(tagEnd("<a b='>'", 1)).toBe(-1);
    });
});

describe("parseTag and serializeTag", () => {
    const tag: Tag = parseTag(CONTENT);

    it("reads the name, every quoted, bare and valueless attribute, and the self-closing mark", () => {
        const expected: readonly Attribute[] = [
            { name: "class", quote: '"', value: "node" },
            { name: "data-id", quote: "'", value: "a>b" },
            { name: "hidden", quote: "", value: null },
            { name: "width", quote: '"', value: "12" },
        ];
        expect(tag.name).toBe("g");
        expect(tag.attributes).toStrictEqual(expected);
        expect(tag.selfClosing).toBe(true);
    });

    it("serializes back to one tag with the original quotes", () => {
        expect(serializeTag(tag)).toBe(`<g class="node" data-id='a>b' hidden width="12"/>`);
        expect(serializeTag(parseTag("svg"))).toBe("<svg>");
    });
});
