import {
    bullet,
    code,
    fenced,
    fencedBlock,
    lines,
    link,
    relative,
} from "@banes-lab/deploy/core/converters/markdown.converter.ts";
import { describe, expect, it } from "vitest";
import { LINE_BREAK } from "@banes-lab/deploy/configuration/constants/deployment.constants.ts";

describe("bullet", () => {
    it("renders a bold label followed by the value", () => {
        expect(bullet("Files", "3")).toBe("• **Files:** 3");
    });
});

describe("code", () => {
    it("wraps the value in backticks", () => {
        expect(code("x")).toBe("`x`");
    });
});

describe("fenced", () => {
    it("wraps the value in a fence without a language", () => {
        expect(fenced("x")).toBe("```x```");
    });
});

describe("fencedBlock", () => {
    it("opens the fence with the language and keeps the body on its own lines", () => {
        expect(fencedBlock("nginx", "body")).toBe(`\`\`\`nginx${LINE_BREAK}body${LINE_BREAK}\`\`\``);
    });
});

describe("link", () => {
    it("renders a markdown link", () => {
        expect(link("site", "https://example.test")).toBe("[site](https://example.test)");
    });
});

describe("relative", () => {
    it("renders a relative discord timestamp", () => {
        expect(relative(42)).toBe("<t:42:R>");
    });
});

describe("lines", () => {
    it("joins entries with line breaks", () => {
        expect(lines(["a", "b"])).toBe(`a${LINE_BREAK}b`);
    });
});
