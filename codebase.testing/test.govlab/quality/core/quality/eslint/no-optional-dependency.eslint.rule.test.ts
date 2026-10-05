import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/quality/eslint/no-optional-dependency.eslint.rule.ts";
import tsParser from "@typescript-eslint/parser";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, parser: tsParser, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-optional-dependency flags an optional injected dependency; allows optional primitive config", () => {
    expect(
        runCases("no-optional-dependency", rule, {
            invalid: [
                {
                    code: "class F { constructor(private readonly audit?: AuditSink) {} }",
                    errors: [{ messageId: "optionalDependency" }],
                },
            ],
            valid: [
                { code: "class F { constructor(private readonly audit: AuditSink) {} }" },
                { code: "class F { constructor(private readonly retries?: number) {} }" },
                { code: "class F { constructor(count?: number) {} }" },
            ],
        }),
    ).toBeGreaterThan(0);
});
