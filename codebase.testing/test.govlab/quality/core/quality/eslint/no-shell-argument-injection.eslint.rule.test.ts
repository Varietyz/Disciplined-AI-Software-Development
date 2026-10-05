import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/quality/eslint/no-shell-argument-injection.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-shell-argument-injection flags args-array + truthy shell, allows safe forms", () => {
    expect(
        runCases("no-shell-argument-injection", rule, {
            invalid: [
                { code: 'execFileSync(cmd, ["pack"], { shell: true });', errors: [{ messageId: "shellArgs" }] },
                { code: 'spawn(cmd, args, { shell: true, stdio: "inherit" });', errors: [{ messageId: "shellArgs" }] },
                { code: 'execFile(cmd, args, { shell: "bash" });', errors: [{ messageId: "shellArgs" }] },
            ],
            valid: [
                'execSync("npm run build");',
                'execFileSync(cmd, ["pack"]);',
                "execFileSync(cmd, { shell: true });",
                "spawn(cmd, args, { shell: false });",
            ],
        }),
    ).toBeGreaterThan(0);
});
