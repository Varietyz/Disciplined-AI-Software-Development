import { describe, expect, it } from "vitest";
import { numberedPhraseIn } from "@ssot/govlab/shared/matchers/vocabulary.matcher.ts";

describe("numberedPhraseIn", () => {
    it("finds a noun followed by a number as whole words, and nothing else", () => {
        expect(numberedPhraseIn("As Figure 2 shows, it holds.", ["figure"])).toBe("Figure 2");
        expect(numberedPhraseIn("The figures 2x agree.", ["figure"])).toBeNull();
        expect(numberedPhraseIn("No numbers here.", ["figure"])).toBeNull();
    });
});
