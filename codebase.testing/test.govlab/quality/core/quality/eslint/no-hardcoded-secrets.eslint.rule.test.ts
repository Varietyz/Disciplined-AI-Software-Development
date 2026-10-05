import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import noHardcodedSecrets from "@govlab/quality/core/quality/eslint/no-hardcoded-secrets.eslint.rule.ts";

const CREDENTIAL = ["user", "pass"].join(":");

const authorized = function authorized(userinfo: string, host: string): string {
    return [`https://${userinfo}`, host].join("@");
};

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-hardcoded-secrets bounds credential detection to the URL authority", () => {
    expect(
        runCases("no-hardcoded-secrets", noHardcodedSecrets, {
            invalid: [
                {
                    code: `const dsn = "${authorized(CREDENTIAL, "internal.example.com/db")}";`,
                    errors: [{ messageId: "secretValueDetected" }],
                },
                {
                    code: `const r = "https://gw.example.com/redirect?next=${authorized(CREDENTIAL, "evil.example.com")}";`,
                    errors: [{ messageId: "secretValueDetected" }],
                },
                {
                    code: `const u = "${authorized(CREDENTIAL, "[::1]:8080/x")}";`,
                    errors: [{ messageId: "secretValueDetected" }],
                },
                {
                    code: `const u = "${authorized(":pass", "internal.host/x")}";`,
                    errors: [{ messageId: "secretValueDetected" }],
                },
            ],
            valid: [
                {
                    code: 'const href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap";',
                },
                { code: 'const logo = "https://govlab.ai/assets/images/raw/govlab-logo.png";' },
                { code: 'const u = "https://example.com/path?a=1&sort=name:asc&owner=team@corp";' },
                { code: 'const u = "https://[::1]:8080/status";' },
                { code: 'const u = "https://user@example.com/a:b";' },
                { code: 'const u = "https://example.com:8080/redirect?next=a:b@c";' },
            ],
        }),
    ).toBeGreaterThan(0);
});
