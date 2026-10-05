import { describe, expect, it } from "vitest";
import { labelOfRule, tokenizeWords } from "@govlab/quality/core/parsers/word.parser.ts";

describe("tokenizeWords", () => {
    it("splits on case and digit boundaries and lower-cases every token", () => {
        expect(tokenizeWords("noUnusedVars")).toStrictEqual(["no", "unused", "vars"]);
        expect(tokenizeWords("CWE79Injection")).toStrictEqual(["cwe", "79", "injection"]);
    });

    it("treats every non-alphanumeric character as a separator", () => {
        expect(tokenizeWords("no-implicit_any.check")).toStrictEqual(["no", "implicit", "any", "check"]);
        expect(tokenizeWords("   ")).toStrictEqual([]);
        expect(tokenizeWords("")).toStrictEqual([]);
    });
});

describe("labelOfRule", () => {
    it("keeps a plain rule name and trims a fully-qualified checkstyle class", () => {
        expect(labelOfRule("  no-unused-vars  ")).toBe("no-unused-vars");
        expect(labelOfRule("com.puppycrawl.tools.checkstyle.checks.FinalLocalVariableCheck")).toBe(
            "FinalLocalVariableCheck",
        );
        expect(labelOfRule("some.other.namespace.Rule")).toBe("some.other.namespace.Rule");
    });
});
