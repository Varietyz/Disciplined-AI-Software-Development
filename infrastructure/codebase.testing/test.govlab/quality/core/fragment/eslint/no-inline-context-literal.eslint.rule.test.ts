import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/fragment/eslint/no-inline-context-literal.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-inline-context-literal flags a frozen prompt-defining const", () => {
    expect(
        runCases("no-inline-context-literal", rule, {
            invalid: [{ code: 'const SYSTEM_PROMPT = "always answer helpfully";', errors: [{ messageId: "inline" }] }],
            valid: [
                { code: "const SYSTEM_PROMPT = buildPrompt();" },
                { code: 'const helper = "just a normal string";' },
            ],
        }),
    ).toBeGreaterThan(0);
});
