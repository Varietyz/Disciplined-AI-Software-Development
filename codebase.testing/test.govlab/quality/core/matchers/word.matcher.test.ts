import { expect, test } from "vitest";
import { isWordBoundary, wordIncludes } from "@govlab/quality/core/matchers/word.matcher.ts";

test("wordIncludes matches a whole identifier and never a substring of a longer one", () => {
    expect(wordIncludes("import { runRuff } from 'x';", "runRuff")).toBe(true);
    expect(wordIncludes("const runRuffLater = 1;", "runRuff")).toBe(false);
    expect(wordIncludes("$runRuff", "runRuff")).toBe(false);
});

test("isWordBoundary treats punctuation and the empty string as boundaries", () => {
    expect(isWordBoundary(" ")).toBe(true);
    expect(isWordBoundary("")).toBe(true);
    expect(isWordBoundary("a")).toBe(false);
    expect(isWordBoundary("$")).toBe(false);
});
