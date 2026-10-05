import { describe, expect, it } from "vitest";
import { validateSpine } from "@govlab/docs/core/validators/document.validator.ts";

const KEYS = ["type", "name", "summary"];

const codesOf = function codesOf(source: string, keys: readonly string[], options = {}): string[] {
    return validateSpine(source, keys, options).map((defect) => defect.code);
};

describe("validateSpine", () => {
    it("passes a well-formed document", () => {
        expect(
            codesOf("---\ntype: readme\nname: foo\nsummary: what it is\n---\n\n# Foo\n\nfree content.", KEYS),
        ).toStrictEqual([]);
    });

    it("reports missing frontmatter, a missing field and a missing title", () => {
        expect(codesOf("# Title\nbody", KEYS)).toStrictEqual(["no-frontmatter"]);
        const codes = new Set(codesOf("---\ntype: readme\n---\nno heading here", KEYS));
        expect(codes.has("missing-field")).toBe(true);
        expect(codes.has("no-title")).toBe(true);
    });

    it("waives the title for frontmatter-only specs and the frontmatter for heading-first documents", () => {
        const prompt = "---\nname: debug-agent\ndescription: enforces the gates\n---\n\n> a prompt, not a heading.";
        expect(codesOf(prompt, ["name", "description"], { requireTitle: false })).toStrictEqual([]);
        expect(codesOf(prompt, ["name", "description", "type"], { requireTitle: false })).toStrictEqual([
            "missing-field",
        ]);
        expect(codesOf("# Reorganize\n\nbody", [], { requireFrontmatter: false })).toStrictEqual([]);
        expect(codesOf("just prose, no heading", [], { requireFrontmatter: false })).toStrictEqual(["no-title"]);
    });
});
