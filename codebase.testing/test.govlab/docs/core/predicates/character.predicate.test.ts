import { describe, expect, it } from "vitest";
import { isAsciiAlnum, isAsciiLower, isKebab } from "@govlab/docs/core/predicates/character.predicate.ts";

describe("the character predicates", () => {
    it("classify single characters", () => {
        expect(["a", "Z", "7", "-"].map(isAsciiAlnum)).toStrictEqual([true, true, true, false]);
        expect(["a", "A"].map(isAsciiLower)).toStrictEqual([true, false]);
    });

    it("accept a kebab name and refuse edge, doubled or foreign hyphens and other characters", () => {
        expect(["scale-docs", "a1", "-a", "a-", "a--b", "Aa", "a_b", "", 7].map(isKebab)).toStrictEqual([
            true,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ]);
    });
});
