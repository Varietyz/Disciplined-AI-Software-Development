import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/quality/eslint/no-increment-operator.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-increment-operator fixes unused-value ++/-- and skips value-used positions", () => {
    expect(
        runCases("no-increment-operator", rule, {
            invalid: [
                { code: "let i = 0; i++;", errors: [{ messageId: "unexpected" }], output: "let i = 0; i += 1;" },
                { code: "let i = 0; --i;", errors: [{ messageId: "unexpected" }], output: "let i = 0; i -= 1;" },
                {
                    code: "for (let i = 0; i < 3; i++) { doThing(); }",
                    errors: [{ messageId: "unexpected" }],
                    output: "for (let i = 0; i < 3; i += 1) { doThing(); }",
                },
                {
                    code: "for (let i = 0, j = 9; i < j; i++, j--) {}",
                    errors: [{ messageId: "unexpected" }, { messageId: "unexpected" }],
                    output: "for (let i = 0, j = 9; i < j; i += 1, j -= 1) {}",
                },
                { code: "const x = arr[i++];", errors: [{ messageId: "unexpected" }], output: null },
            ],
            valid: ["let i = 0; i += 1;", "for (let i = 0; i < 3; i += 1) {}"],
        }),
    ).toBeGreaterThan(0);
});
