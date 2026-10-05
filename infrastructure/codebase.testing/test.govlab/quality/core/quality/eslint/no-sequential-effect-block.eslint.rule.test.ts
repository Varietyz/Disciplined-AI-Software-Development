import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import noSequentialEffectBlock from "@govlab/quality/core/quality/eslint/no-sequential-effect-block.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-sequential-effect-block flags 3+ awaited effects threading a shared first-arg subject", () => {
    expect(
        runCases("no-sequential-effect-block", noSequentialEffectBlock, {
            invalid: [
                {
                    code: "async function finishTurn(ctx){ await logTurn(ctx, t); await mergeKnowledge(ctx, t); await applyPlanDelta(ctx, t); }",
                    errors: [{ messageId: "sequentialEffectBlock" }],
                },
                {
                    code: "async function finishTurn(ctx){ await logTurn(ctx, t); await advisory(ctx, t); await mergeKnowledge(ctx, t); await applyPlanDelta(ctx, t); }",
                    errors: [{ messageId: "sequentialEffectBlock" }],
                },
            ],
            valid: [
                { code: "async function f(ctx){ await a(ctx, x); await b(ctx, x); }" },
                {
                    code: "function roleDiff(acc){ pushName(acc, d); pushFlags(acc, d); pushPerms(acc, d); return acc; }",
                },
                {
                    code: "async function f(){ await validate(a, errs); await validate(b, errs); await validate(c, errs); }",
                },
                { code: "async function f(){ await a(x); await b(y); await c(z); }" },
                { code: "async function f(ctx){ await a(ctx); sync(ctx); await b(ctx); await c(ctx); }" },
            ],
        }),
    ).toBeGreaterThan(0);
});
