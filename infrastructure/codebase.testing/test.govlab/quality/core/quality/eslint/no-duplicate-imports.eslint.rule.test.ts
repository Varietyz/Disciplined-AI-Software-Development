import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/quality/eslint/no-duplicate-imports.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-duplicate-imports merges named-only duplicates, skips namespace/default mixes", () => {
    expect(
        runCases("no-duplicate-imports", rule, {
            invalid: [
                {
                    code: 'import { a } from "s";\nimport { b } from "s";',
                    errors: [{ messageId: "duplicate" }],
                    output: 'import { a, b } from "s";\n',
                },
                {
                    code: 'import * as x from "s";\nimport { a } from "s";',
                    errors: [{ messageId: "duplicate" }],
                    output: null,
                },
            ],
            valid: ['import { a, b } from "s";', 'import a from "a";\nimport b from "b";'],
        }),
    ).toBeGreaterThan(0);
});
