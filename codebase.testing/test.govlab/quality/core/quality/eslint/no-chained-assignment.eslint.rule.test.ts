import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/quality/eslint/no-chained-assignment.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-chained-assignment splits statement-position chains, skips expression-position", () => {
    expect(
        runCases("no-chained-assignment", rule, {
            invalid: [
                { code: "a = b = c;", errors: [{ messageId: "unexpected" }], output: "b = c;\na = b;" },
                {
                    code: "a = b = c = d;",
                    errors: [{ messageId: "unexpected" }, { messageId: "unexpected" }],
                    output: "c = d;\nb = c;\na = b;",
                },
                { code: "foo(a = b = c);", errors: [{ messageId: "unexpected" }], output: null },
            ],
            valid: ["a = c;", "let x = 1;"],
        }),
    ).toBeGreaterThan(0);
});
