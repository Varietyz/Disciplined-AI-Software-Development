import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/fragment/eslint/no-duplicate-fragment.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-duplicate-fragment flags two fragments with identical bodies", () => {
    expect(
        runCases("no-duplicate-fragment", rule, {
            invalid: [
                {
                    code: 'defineContextFragment({ id: "a", body: () => "same" }); defineContextFragment({ id: "b", body: () => "same" });',
                    errors: [{ messageId: "duplicate" }],
                },
            ],
            valid: [
                {
                    code: 'defineContextFragment({ id: "a", body: () => "one" }); defineContextFragment({ id: "b", body: () => "two" });',
                },
            ],
        }),
    ).toBeGreaterThan(0);
});
