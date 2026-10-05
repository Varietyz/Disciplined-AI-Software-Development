import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/quality/eslint/no-fake-abstract-this.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-fake-abstract-this flags branching on `this` and allows real conditions", () => {
    expect(
        runCases("no-fake-abstract-this", rule, {
            invalid: [
                {
                    code: "class A { m() { if (this) { throw new Error('x'); } return 1; } }",
                    errors: [{ messageId: "fakeAbstract" }],
                },
                { code: "class A { m() { if (!this) { return; } } }", errors: [{ messageId: "fakeAbstract" }] },
                { code: "class A { m() { if (this === null) { return; } } }", errors: [{ messageId: "fakeAbstract" }] },
                {
                    code: "class A { m() { if (this !== undefined) { throw new Error('x'); } } }",
                    errors: [{ messageId: "fakeAbstract" }],
                },
            ],
            valid: [
                "class A { m() { if (this.ready) { return 1; } return 0; } }",
                "function f(x) { if (x) { return x; } return 0; }",
                "class A { m(v) { if (v === null) { return; } } }",
            ],
        }),
    ).toBeGreaterThan(0);
});
