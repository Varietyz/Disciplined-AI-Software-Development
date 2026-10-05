import { bullets, image, note, numbered, section } from "@banes-lab/content/core/renderers/markdown.renderer.ts";
import { describe, expect, it } from "vitest";

describe("section, bullets and numbered", () => {
    it("titles a section and separates its parts by a paragraph break", () => {
        expect(section("Title", "one", "two")).toBe("## Title\n\none\n\ntwo");
    });

    it("lists items as bullets or as a numbered list, one per line", () => {
        expect(bullets(["a", "b"])).toBe("- a\n- b");
        expect(numbered(["a", "b"])).toBe("1. a\n2. b");
    });
});

describe("image and note", () => {
    it("writes a sized image tag and an italic link", () => {
        expect(image("/logo.webp", "16", "Logo")).toBe('<img src="/logo.webp" alt="Logo" width="16" height="16" />');
        expect(note("Read it.", "/x")).toBe("_[Read it.](/x)_");
    });
});
