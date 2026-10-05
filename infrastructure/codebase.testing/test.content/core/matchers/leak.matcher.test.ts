import { describe, expect, it } from "vitest";
import { identifierTokens, leaksIn, privateTermScanner } from "@banes-lab/content/core/matchers/leak.matcher.ts";
import { PRIVATE_TERMS } from "@banes-lab/content/configuration/constants/leak.constants.ts";
import type { PrivateTerm } from "@banes-lab/content/types/leak.types.ts";
import { fingerprintOf } from "@govlab/content-fingerprint";

const termOf = function termOf(phrase: string): PrivateTerm {
    const words = phrase.split(" ");
    const [first = ""] = words;
    return {
        digest: fingerprintOf([phrase]),
        first: fingerprintOf([first]),
        length: first.length,
        words: words.length,
    };
};

const PHRASE = termOf("orchid lantern");
const WORD = termOf("quillon");

describe("privateTermScanner", () => {
    it("finds a private phrase and a private word by digest, across case and punctuation", () => {
        const scan = privateTermScanner([PHRASE, WORD], []);
        const hits = scan("first line\nthe Orchid-Lantern repo, and QUILLON.ai");
        expect(hits).toStrictEqual([
            { digest: PHRASE.digest, line: 2 },
            { digest: WORD.digest, line: 2 },
        ]);
    });

    it("passes a text whose words only share a first word with a phrase", () => {
        expect(privateTermScanner([PHRASE], [])("an orchid garden")).toStrictEqual([]);
    });

    it("skips the exact string an allowance names and still finds every other occurrence", () => {
        const scan = privateTermScanner([WORD], ["mail@quillon.ai"]);
        expect(scan("write to mail@quillon.ai")).toStrictEqual([]);
        expect(scan("write to mail@quillon.ai or visit quillon")).toStrictEqual([{ digest: WORD.digest, line: 1 }]);
    });

    it("holds every registered term as a digest pair with a word count", () => {
        expect(PRIVATE_TERMS.length).toBeGreaterThan(0);
        for (const term of PRIVATE_TERMS) {
            expect(term.digest).toHaveLength(64);
            expect(term.first).toHaveLength(64);
            expect(term.words).toBeGreaterThan(0);
            expect(term.length).toBeGreaterThan(0);
        }
    });
});

const TOKENS = new Set(["claims_are_lies", "closure-paths-via-ssot", "build", "verify", "no_regex"]);
const ROOTS = new Set(["engine.root", ".host", "_output"]);

describe("leaksIn", () => {
    it("reports an internal identifier inside inline code", () => {
        const matches = leaksIn("The rule `claims_are_lies` holds.", TOKENS, ROOTS);
        expect(matches).toStrictEqual([{ reason: "inline-code", token: "claims_are_lies" }]);
    });

    it("reports an identifier-shaped plain token the set holds", () => {
        const matches = leaksIn("Run closure-paths-via-ssot before shipping.", TOKENS, ROOTS);
        expect(matches).toStrictEqual([{ reason: "identifier", token: "closure-paths-via-ssot" }]);
    });

    it("never reports a plain English word from the set outside inline code", () => {
        expect(leaksIn("Build the plan, then verify it.", TOKENS, ROOTS)).toStrictEqual([]);
    });

    it("reports a workspace path in prose and in inline code", () => {
        const matches = leaksIn("See engine.root/engine.web/types and `.host/rules`.", TOKENS, ROOTS);
        expect(matches.map((match) => match.reason)).toStrictEqual(["path", "path"]);
    });

    it("does not report a hyphenated word the set does not hold", () => {
        expect(leaksIn("A multi-agent, well-defined surface.", TOKENS, ROOTS)).toStrictEqual([]);
    });
});

describe("identifierTokens", () => {
    it("keeps only the identifier-shaped plain tokens of a text", () => {
        expect(identifierTokens("A comment-strip auto-fix per language, so adding one means new code")).toStrictEqual([
            "comment-strip",
            "auto-fix",
        ]);
        expect(identifierTokens("Plain words only here")).toStrictEqual([]);
    });
});
