import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/quality/eslint/no-mutable-parameter.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-mutable-parameter flags mutating a parameter in place; allows mutating locals", () => {
    expect(
        runCases("no-mutable-parameter", rule, {
            invalid: [
                {
                    code: "function addTag(foo, tag) { foo.tags.push(tag); return foo; }",
                    errors: [{ messageId: "mutableParam" }],
                },
                { code: "function f(arr) { arr.sort(); }", errors: [{ messageId: "mutableParam" }] },
            ],
            valid: [
                { code: "function f(foo) { const copy = [...foo.tags]; copy.push(1); return copy; }" },
                { code: "function f() { const arr = []; arr.push(1); return arr; }" },
                { code: "const arr = []; arr.push(1);" },
            ],
        }),
    ).toBeGreaterThan(0);
});
