import { describe, expect, it } from "vitest";
import { isExternalTarget, isRelativeTarget } from "@govlab/docs/core/predicates/reference.predicate.ts";
import { isCodeFile } from "@govlab/docs/core/predicates/source.predicate.ts";

describe("the target predicates", () => {
    it("tell an external, a relative and a workspace target apart", () => {
        expect(["", "https://x.dev", "/abs", "~/home", "@scope/pkg", "docs/a.md"].map(isExternalTarget)).toStrictEqual([
            true,
            true,
            true,
            true,
            true,
            false,
        ]);
        expect(["./a.md", "../a.md", "a.md"].map(isRelativeTarget)).toStrictEqual([true, true, false]);
    });
});

describe("isCodeFile", () => {
    it("accepts source extensions and refuses prose", () => {
        expect([isCodeFile("a.ts"), isCodeFile("a.md")]).toStrictEqual([true, false]);
    });
});
