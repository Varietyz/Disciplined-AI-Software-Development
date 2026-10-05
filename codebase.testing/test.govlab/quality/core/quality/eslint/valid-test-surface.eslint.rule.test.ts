import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import { relativePath } from "@ssot/paths";
import validTestSurface from "@govlab/quality/core/quality/eslint/valid-test-surface.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};
const REPO = "/repo";
const QUALITY = `${REPO}/${relativePath("govlab.quality")}`;
const FILE = `${QUALITY}/tests/foo.test.ts`;

test("valid-test-surface accepts canonical surface tags, rejects unknown ones", () => {
    expect(
        runCases("valid-test-surface", validTestSurface, {
            invalid: [
                { code: "test('[bogus] does a thing', () => {});", errors: 1, filename: FILE },
                { code: "it('[not-a-surface] works', () => {});", errors: 1, filename: FILE },
            ],
            valid: [
                { code: "test('[semantic] correct output', () => {});", filename: FILE },
                { code: "test('[security] rejects injection', () => {});", filename: FILE },
                { code: "test('[semantic-correctness] full id form', () => {});", filename: FILE },
                { code: "test('no surface tag at all', () => {});", filename: FILE },
                { code: "test('[bogus] not in a test file', () => {});", filename: `${QUALITY}/src/foo.ts` },
            ],
        }),
    ).toBeGreaterThan(0);
});
