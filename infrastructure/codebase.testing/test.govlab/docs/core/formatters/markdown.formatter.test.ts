import {
    bullets,
    renderConfiguration,
    renderFieldFragment,
    renderQuickStart,
    renderRenderable,
    titleCase,
} from "@govlab/docs/core/formatters/markdown.formatter.ts";
import { describe, expect, it } from "vitest";

describe("titleCase and bullets", () => {
    it("turn a kebab id into a heading and items into a list", () => {
        expect(titleCase("quality-governance")).toBe("Quality Governance");
        expect(bullets(["a", "b"])).toBe("- a\n- b");
    });
});

describe("renderRenderable", () => {
    it("renders a string, a string list and record arrays, and nothing for other shapes", () => {
        expect(renderRenderable("plain")).toBe("plain");
        expect(renderRenderable(["a", "b"])).toBe("- a\n- b");
        expect(renderRenderable([{ k: "v" }])).toBe("- **k**: v");
        expect(renderRenderable({})).toBe("");
    });
});

describe("the field renderers", () => {
    it("render quick-start blocks, configuration options and api notes", () => {
        expect(renderQuickStart([{ code: "run()", intent: "Run", lang: "ts" }])).toContain("```ts");
        expect(renderConfiguration([{ default: "3", note: "depth", option: "max" }])).toBe(
            "- `max` (default: `3`) — depth",
        );
        expect(renderConfiguration([{ note: "both", option: "a.one, a.two" }])).toBe("- `a.one` and `a.two` — both");
        expect(renderConfiguration([{ option: "a, b, c" }])).toBe("- `a`, `b` and `c`");
        expect(renderFieldFragment("apiNotes", [{ name: "x", note: "a note" }])).toBe("a note");
        expect(renderFieldFragment("overview", "text")).toBe("text");
    });
});
