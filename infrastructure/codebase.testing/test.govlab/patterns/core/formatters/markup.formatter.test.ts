import { describe, expect, it } from "vitest";
import { escapeXml } from "@govlab/patterns/core/formatters/markup.formatter.ts";

describe("escapeXml", () => {
    it("escapes the five XML-significant characters and leaves the rest", () => {
        expect(escapeXml(`<a href="x">'&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&apos;&amp;&apos;&lt;/a&gt;");
        expect(escapeXml("plain")).toBe("plain");
    });
});
