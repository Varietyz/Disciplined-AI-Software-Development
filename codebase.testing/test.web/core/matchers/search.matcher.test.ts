import { describe, expect, it } from "vitest";
import {
    markupWords,
    matchesAll,
    queryTerms,
    termMatches,
    withinOneEdit,
} from "@banes-lab/web/core/matchers/search.matcher.ts";

describe("queryTerms", () => {
    it("normalizes the query into distinct words", () => {
        expect(queryTerms("Gates  gate, CHECK")).toStrictEqual(["gate", "check"]);
        expect(queryTerms("  ")).toStrictEqual([]);
    });
});

describe("markupWords", () => {
    it("reads the words a reader sees, never the tag or its link", () => {
        const words = markupWords('The <a href="/ontology#drift">drift</a> check');
        expect(words).toStrictEqual(["the", "drift", "check"]);
        expect(words.includes("href")).toBe(false);
    });

    it("indexes a camel-case identifier whole and by each of its words", () => {
        expect(markupWords("call markupWords here")).toStrictEqual(["call", "markupword", "markup", "word", "here"]);
        expect(markupWords("HTTPServer")).toStrictEqual(["httpserver"]);
    });

    it("drops digit runs, long hexadecimal runs and overlong tokens", () => {
        const hash = "a57a1a8b679abe41a947b6b9b6f4de222db1a9514b2fbdabe9454e07c724eb09";
        expect(markupWords(`walk ${hash} step 1063 ${"x".repeat(41)} cafe`)).toStrictEqual(["walk", "step", "cafe"]);
    });
});

describe("withinOneEdit", () => {
    it("accepts one substitution, insertion or deletion", () => {
        expect(withinOneEdit("verify", "verity")).toBe(true);
        expect(withinOneEdit("verify", "verifyy")).toBe(true);
        expect(withinOneEdit("verify", "vrify")).toBe(true);
    });

    it("refuses two edits", () => {
        expect(withinOneEdit("verify", "vreify")).toBe(false);
        expect(withinOneEdit("verify", "ver")).toBe(false);
    });
});

describe("termMatches", () => {
    it("matches a word by its prefix", () => {
        expect(termMatches("gat", ["gatekeeper"])).toBe(true);
    });

    it("forgives one slip in a long term", () => {
        expect(termMatches("chalk", ["checks"])).toBe(false);
        expect(termMatches("verfy", ["verifying"])).toBe(true);
        expect(termMatches("ontolgy", ["ontology"])).toBe(true);
    });

    it("never fuzzes a short term onto a different word", () => {
        expect(termMatches("gate", ["rate", "date", "late"])).toBe(false);
    });
});

describe("matchesAll", () => {
    it("holds only when every term finds a word", () => {
        expect(matchesAll(["gate", "check"], ["the", "gate", "checks"])).toBe(true);
        expect(matchesAll(["gate", "drift"], ["the", "gate", "checks"])).toBe(false);
    });

    it("never matches an empty query", () => {
        expect(matchesAll([], ["anything"])).toBe(false);
    });
});
