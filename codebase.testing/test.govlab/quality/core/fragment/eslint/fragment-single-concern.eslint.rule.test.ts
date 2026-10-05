import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/fragment/eslint/fragment-single-concern.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("fragment-single-concern flags a non-kebab concern", () => {
    expect(
        runCases("fragment-single-concern", rule, {
            invalid: [{ code: 'defineContextFragment({ concern: "NotKebab" });', errors: [{ messageId: "notKebab" }] }],
            valid: [{ code: 'defineContextFragment({ concern: "authentication" });' }],
        }),
    ).toBeGreaterThan(0);
});
