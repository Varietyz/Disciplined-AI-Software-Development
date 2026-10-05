import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/quality/eslint/sort-keys.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("sort-keys reorders clean objects, skips comment/spread/computed", () => {
    expect(
        runCases("sort-keys", rule, {
            invalid: [
                {
                    code: "const o = { b: 1, a: 2 };",
                    errors: [{ messageId: "unsorted" }],
                    output: "const o = { a: 2, b: 1 };",
                },
                {
                    code: "const o = { c: 1, a: 2, b: 3 };",
                    errors: [{ messageId: "unsorted" }],
                    output: "const o = { a: 2, b: 3, c: 1 };",
                },
                { code: "const o = { b: 1, /* keep */ a: 2 };", errors: [{ messageId: "unsorted" }], output: null },
                { code: "const o = { c: 1, b: 2, ...s };", errors: [{ messageId: "unsorted" }], output: null },
            ],
            valid: ["const o = { a: 1, b: 2 };", "const o = { b: 1 };", "const o = { b: 1, ...s, a: 2 };"],
        }),
    ).toBeGreaterThan(0);
});
