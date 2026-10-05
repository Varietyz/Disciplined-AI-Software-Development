import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import noTimestampOrdering from "@govlab/quality/core/quality/eslint/no-timestamp-ordering.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-timestamp-ordering flags ordering two recorded instants, in call and variable form", () => {
    expect(
        runCases("no-timestamp-ordering", noTimestampOrdering, {
            invalid: [
                { code: "const older = a.createdAt.getTime() < b.createdAt.getTime();", errors: 1 },
                { code: "const newer = first.updatedAt.getTime() >= second.updatedAt.getTime();", errors: 1 },
                {
                    code: "const aMs = a.createdAt.getTime(); const bMs = b.createdAt.getTime(); const older = aMs < bMs;",
                    errors: 1,
                },
                { code: "const aMs = a.createdAt.getTime(); const older = aMs <= b.createdAt.getTime();", errors: 1 },
                { code: "rows.sort((x, y) => x.at.getTime() - y.at.getTime());", errors: 1 },
            ],
            valid: [],
        }),
    ).toBeGreaterThan(0);
});

test("no-timestamp-ordering leaves deadline-against-current-time comparisons alone", () => {
    expect(
        runCases("no-timestamp-ordering", noTimestampOrdering, {
            invalid: [],
            valid: [
                { code: "const expired = new Date(deadline).getTime() <= now.getTime();" },
                { code: "const expired = Date.now() >= new Date(deadline).getTime();" },
                { code: "const nowMs = now.getTime(); const expired = new Date(deadline).getTime() <= nowMs;" },
                { code: "const deadlineMs = new Date(deadline).getTime(); const expired = deadlineMs <= nowMs;" },
                { code: "const stale = Date.now() - record.syncedAt.getTime() > INTERVAL_MS;" },
                { code: "const within = new Date(trialEnd).getTime() > nowMs;" },
            ],
        }),
    ).toBeGreaterThan(0);
});
