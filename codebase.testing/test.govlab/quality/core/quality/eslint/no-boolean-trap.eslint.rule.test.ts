import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/quality/eslint/no-boolean-trap.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-boolean-trap flags a call/construction with 2+ positional boolean literals", () => {
    expect(
        runCases("no-boolean-trap", rule, {
            invalid: [
                { code: "createFoo(true, false, true);", errors: [{ messageId: "booleanTrap" }] },
                { code: "new Foo(true, false);", errors: [{ messageId: "booleanTrap" }] },
            ],
            valid: [
                { code: "createFoo(true);" },
                { code: "createFoo({ active: true, archived: false, notify: true });" },
                { code: "f(x, true);" },
                { code: "f(1, 'a', null);" },
                { code: "new Foo(config);" },
            ],
        }),
    ).toBeGreaterThan(0);
});
