import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/fragment/eslint/no-hardcoded-context-token.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-hardcoded-context-token flags a stack token inside a fragment body", () => {
    expect(
        runCases("no-hardcoded-context-token", rule, {
            invalid: [
                {
                    code: 'defineContextFragment({ body: "we use npm to install deps" });',
                    errors: [{ messageId: "token" }],
                },
            ],
            valid: [
                { code: 'defineContextFragment({ body: "neutral prose with no stack tokens" });' },
                { code: 'const note = "we use npm here";' },
            ],
        }),
    ).toBeGreaterThan(0);
});
