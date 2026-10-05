import { describe, expect, it } from "vitest";
import { forbiddenToken, unsafeSvg } from "@govlab/patterns/configuration/strings/markup.strings.ts";

describe("the markup strings", () => {
    it("quote the forbidden token and label the unsafe vector", () => {
        expect(forbiddenToken("url(")).toBe('forbidden token "url("');
        expect(unsafeSvg("walk", "a, b")).toBe("unsafe SVG (walk): a, b");
    });
});
