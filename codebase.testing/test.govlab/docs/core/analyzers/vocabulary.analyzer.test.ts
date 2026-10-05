import { describe, expect, it } from "vitest";
import { bannedLanguage } from "@govlab/docs/core/analyzers/vocabulary.analyzer.ts";

const termsOf = function termsOf(source: string): string[] {
    return bannedLanguage(source).map((hit) => hit.term);
};

describe("bannedLanguage", () => {
    it("flags narration terms in prose", () => {
        const terms = new Set(termsOf("This module was previously named Foo and no longer applies."));
        expect(terms.has("previously")).toBe(true);
        expect(terms.has("no longer")).toBe(true);
    });

    it("skips inline code, fenced blocks and tilde fences", () => {
        expect(termsOf("Use `previously` here.\n```\nconst x = 1;\n```\nAll current now.")).toStrictEqual([]);
        expect(termsOf("~~~\npreviously the old\n~~~")).toStrictEqual([]);
    });

    it("skips quoted wording and still flags unquoted narration", () => {
        expect(termsOf("> the indicators cannot be used to make comparisons")).toStrictEqual([]);
        expect(termsOf('The rejected line "it used to work" stays quoted.')).toStrictEqual([]);
        expect(termsOf("The rejected line “it used to work” stays quoted.")).toStrictEqual([]);
        expect(termsOf("This step used to run first.")).toStrictEqual(["used to"]);
    });

    it("respects word boundaries and skips frontmatter", () => {
        expect(termsOf("the oldest cheese").filter((term) => term === "the old")).toStrictEqual([]);
        expect(termsOf("---\nnote: previously\n---\n\n# T\n\n> n\n\nbody previously")).toStrictEqual(["previously"]);
    });
});
