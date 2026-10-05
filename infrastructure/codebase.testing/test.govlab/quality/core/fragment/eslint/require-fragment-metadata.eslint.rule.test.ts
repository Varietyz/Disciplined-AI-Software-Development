import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/fragment/eslint/require-fragment-metadata.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("require-fragment-metadata flags a fragment missing required metadata", () => {
    expect(
        runCases("require-fragment-metadata", rule, {
            invalid: [{ code: 'defineContextFragment({ id: "x" });', errors: [{ messageId: "missing" }] }],
            valid: [
                {
                    code: 'defineContextFragment({ id: "x", concern: "y", applies: [], stable: true, order: 1, params: [], body: () => "" });',
                },
            ],
        }),
    ).toBeGreaterThan(0);
});
