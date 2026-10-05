import { ROOT, relativePath } from "@ssot/paths";
import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/quality/eslint/no-direct-environment-access.eslint.rule.ts";
import tsParser from "@typescript-eslint/parser";

const MEMBER = `${ROOT}/${relativePath("govlab.pipeline")}`;
const TESTS = `${ROOT}/${relativePath("codebase.testing.govlab")}/pipeline`;
const INSIDE = `${MEMBER}/core/resolvers/shell.resolver.ts`;
const READ = 'const shell = process.env["ComSpec"];';

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, parser: tsParser, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-direct-environment-access flags every environment read inside a package and allows it at a consumer", () => {
    expect(
        runCases("no-direct-environment-access", rule, {
            invalid: [
                { code: READ, errors: [{ messageId: "noProcessEnvDirect" }], filename: INSIDE },
                {
                    code: 'const shell = process["env"].ComSpec;',
                    errors: [{ messageId: "noProcessEnvDirect" }],
                    filename: INSIDE,
                },
                { code: "const { env } = process;", errors: [{ messageId: "noProcessEnvDirect" }], filename: INSIDE },
                {
                    code: 'import { env } from "node:process";',
                    errors: [{ messageId: "noProcessEnvDirect" }],
                    filename: INSIDE,
                },
            ],
            valid: [
                { code: READ, filename: `${MEMBER}/runtime/entrypoints/validation.entrypoint.ts` },
                { code: READ, filename: `${MEMBER}/tests/shell.test.ts` },
                { code: READ, filename: `${TESTS}/core/resolvers/shell.resolver.test.ts` },
                { code: "const { argv } = process;", filename: INSIDE },
                { code: 'import { argv } from "node:process";', filename: INSIDE },
            ],
        }),
    ).toBeGreaterThan(0);
});
