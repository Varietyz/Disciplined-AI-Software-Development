import { expect, test } from "vitest";
import { mkdirSync, mkdtempSync } from "node:fs";
import { RuleTester } from "eslint";
import path from "node:path";
import requireTestCoverage from "@govlab/quality/core/quality/eslint/require-test-coverage.eslint.rule.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const workspace = mkdtempSync(path.join(tmpdir(), "coverage-gate-"));
const pkgDir = path.join(workspace, "govlab.sample");
mkdirSync(path.join(pkgDir, "tests"), { recursive: true });
mkdirSync(path.join(pkgDir, "src"), { recursive: true });
writeVerbatim(path.join(pkgDir, "package.json"), '{ "name": "@govlab/sample" }\n');
writeVerbatim(
    path.join(pkgDir, "tests", "foo.test.ts"),
    'import { covered } from "@govlab/sample/src/foo.ts";\ncovered();\n',
);
writeVerbatim(path.join(pkgDir, "tests", "bar.test.ts"), 'import plug from "@govlab/sample/src/bar.ts";\nplug();\n');

const PKG = pkgDir.split("\\").join("/");
const FILE = `${PKG}/src/foo.ts`;
const BAR = `${PKG}/src/bar.ts`;
const NODEFAULT = `${PKG}/src/nodefault.ts`;

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("require-test-coverage flags uncovered constructs and passes covered/data/re-export/out-of-scope", () => {
    expect(
        runCases("require-test-coverage", requireTestCoverage, {
            invalid: [
                { code: "export const missing = () => {};", errors: 1, filename: FILE },
                { code: "export function alsoMissing() {}", errors: 1, filename: FILE },
                { code: "export class Widget {}", errors: 1, filename: FILE },
                { code: "export default function widget() {}", errors: 1, filename: NODEFAULT },
                { code: "const helper = () => {};\nexport { helper };", errors: 1, filename: FILE },
                { code: "export const ctrl = { list() {} };", errors: 1, filename: FILE },
                { code: "export const svc = { get: () => {} };", errors: 1, filename: FILE },
                { code: "function w() {}\nexport default w;", errors: 1, filename: NODEFAULT },
                { code: "export const account = new AccountService();", errors: 1, filename: FILE },
                { code: "export const mgr = createManager();", errors: 1, filename: FILE },
            ],
            valid: [
                { code: "export const covered = () => {};", filename: FILE },
                { code: "export default function plug() {}", filename: BAR },
                { code: "export const DATA = { a: 1 };", filename: FILE },
                { code: "export { y } from '@govlab/sample/src/y.ts';", filename: FILE },
                { code: "const covered = () => {};\nexport { covered };", filename: FILE },
                { code: "const NUM = 5;\nexport { NUM };", filename: FILE },
                { code: "export const ARR = [1, 2, 3];", filename: FILE },
                { code: "export const NUM2 = 42;", filename: FILE },
                { code: "export const s = new Set([1, 2]);", filename: FILE },
                { code: "export const mapped = [1, 2].map((n) => n);", filename: FILE },
                { code: "export const frozen = Object.freeze({ a: 1 });", filename: FILE },
                { code: "export const missing = () => {};", filename: `${PKG}/tests/foo.test.ts` },
            ],
        }),
    ).toBeGreaterThan(0);
});
