import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/quality/eslint/no-constructor-callback.eslint.rule.ts";
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

test("no-constructor-callback flags a function-typed constructor parameter", () => {
    expect(
        runCases("no-constructor-callback", rule, {
            invalid: [
                {
                    code: "class F { constructor(private readonly onSaved: (foo: Foo) => void) {} }",
                    errors: [{ messageId: "constructorCallback" }],
                },
                { code: "class F { constructor(cb: () => void) {} }", errors: [{ messageId: "constructorCallback" }] },
            ],
            valid: [
                { code: "class F { constructor(private readonly store: FooStore) {} }" },
                { code: "class F { constructor(count: number) {} }" },
            ],
        }),
    ).toBeGreaterThan(0);
});
