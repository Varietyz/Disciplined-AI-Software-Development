import { describe, expect, it } from "vitest";
import { tokensOf, wordsOf } from "@banes-lab/web/core/normalizers/word.normalizer.ts";

describe("wordsOf", () => {
    it("keeps a word that is only the plural suffix, so no word normalizes to nothing", () => {
        expect(wordsOf("the model's check")).toStrictEqual(["the", "model", "s", "check"]);
    });

    it("splits a phrase into normalized words on every non-word character", () => {
        expect(wordsOf("Fail-Fast / Halt")).toStrictEqual(["fail", "fast", "halt"]);
        expect(wordsOf("")).toStrictEqual([]);
    });
});

describe("tokensOf", () => {
    it("locates each normalized word and skips tags and the text inside a protected tag", () => {
        expect(tokensOf("Read <code>the tree</code> <em>files</em>")).toStrictEqual([
            { end: 4, start: 0, word: "read" },
            { end: 36, start: 31, word: "file" },
        ]);
    });
});
