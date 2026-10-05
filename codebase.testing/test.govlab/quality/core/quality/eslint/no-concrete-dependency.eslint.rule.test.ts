import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/quality/eslint/no-concrete-dependency.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-concrete-dependency flags constructing a concrete dependency as a class field", () => {
    expect(
        runCases("no-concrete-dependency", rule, {
            invalid: [
                { code: "class F { store = new SqlFooStore(); }", errors: [{ messageId: "concreteDependency" }] },
                {
                    code: "class F { constructor() { this.store = new SqlFooStore(); } }",
                    errors: [{ messageId: "concreteDependency" }],
                },
            ],
            valid: [
                { code: "class F { cache = new Map(); }" },
                { code: "class F { at = new Date(); }" },
                { code: "class F { constructor(store) { this.store = store; } }" },
                { code: "const x = new SqlFooStore();" },
            ],
        }),
    ).toBeGreaterThan(0);
});
