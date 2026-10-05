import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/quality/eslint/sort-imports.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("sort-imports fixes member order and declaration order, skips comment-interleaved blocks", () => {
    expect(
        runCases("sort-imports", rule, {
            invalid: [
                {
                    code: 'import { b, a } from "s";',
                    errors: [{ messageId: "members" }],
                    output: 'import { a, b } from "s";',
                },
                {
                    code: 'import b from "b";\nimport a from "a";',
                    errors: [{ messageId: "declarations" }],
                    output: 'import a from "a";\nimport b from "b";',
                },
                {
                    code: 'import b from "b";\n// comment\nimport a from "a";',
                    errors: [{ messageId: "declarations" }],
                    output: null,
                },
            ],
            valid: ['import { a, b } from "s";', 'import a from "a";\nimport b from "b";'],
        }),
    ).toBeGreaterThan(0);
});
