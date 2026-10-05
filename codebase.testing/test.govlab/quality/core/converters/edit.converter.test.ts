import { describe, expect, it } from "vitest";
import type { CuratedResult } from "@govlab/quality/types/edit.types.ts";
import type { Linter } from "eslint";
import { applyCuratedSuggestions } from "@govlab/quality/core/converters/edit.converter.ts";

const RULE = "@typescript-eslint/explicit-member-accessibility";
const SOURCE = "class C {\n    foo() {}\n}\n";
const FOO_OFFSET = 14;
const SEVERITY_ERROR = 2;
const COLUMN = 5;
const LINE = 2;

const accessibilityMessage = (at: number): Linter.LintMessage => {
    const range: [number, number] = [at, at];
    return {
        column: COLUMN,
        line: LINE,
        message: "Missing accessibility modifier",
        messageId: "missingAccessibility",
        ruleId: RULE,
        severity: SEVERITY_ERROR,
        suggestions: [
            { desc: "Add 'public' accessibility modifier", fix: { range, text: "public " } },
            { desc: "Add 'private' accessibility modifier", fix: { range, text: "private " } },
        ],
    };
};

const resultOf = (messages: Linter.LintMessage[]): CuratedResult => ({ errorCount: messages.length, messages });

describe("applyCuratedSuggestions", () => {
    it("inserts the public modifier, prunes the consumed message, and decrements errorCount", () => {
        const result = resultOf([accessibilityMessage(FOO_OFFSET)]);
        const applied = applyCuratedSuggestions(result, SOURCE);
        expect(applied?.output).toBe("class C {\n    public foo() {}\n}\n");
        expect(applied?.appliedCount).toBe(1);
        expect(result.messages).toHaveLength(0);
        expect(result.errorCount).toBe(0);
    });

    it("selects the public suggestion, never private or protected", () => {
        const result = resultOf([accessibilityMessage(FOO_OFFSET)]);
        const applied = applyCuratedSuggestions(result, SOURCE);
        expect(applied?.output.includes("public foo")).toBe(true);
        expect(applied?.output.includes("private")).toBe(false);
    });

    it("returns null and leaves messages untouched when no curated rule matches", () => {
        const other: Linter.LintMessage = {
            column: COLUMN,
            line: LINE,
            message: "unexpected console statement",
            messageId: "x",
            ruleId: "no-console",
            severity: SEVERITY_ERROR,
        };
        const result = resultOf([other]);
        expect(applyCuratedSuggestions(result, SOURCE)).toBeNull();
        expect(result.messages).toHaveLength(1);
    });
});
