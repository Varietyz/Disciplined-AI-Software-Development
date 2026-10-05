import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import noCallEnumeration from "@govlab/quality/core/quality/eslint/no-call-enumeration.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-call-enumeration flags 3+ consecutive descriptor-object factory calls, not general repetition", () => {
    expect(
        runCases("no-call-enumeration", noCallEnumeration, {
            invalid: [
                {
                    code: "function f(){ reg({ id: 'a', run: x }); reg({ id: 'b', run: y }); reg({ id: 'c', run: z }); }",
                    errors: [{ messageId: "callEnumeration" }],
                },
                {
                    code: "function wire(m){ m.add({ event: 'a', handler: f }); m.add({ event: 'b', handler: g }); m.add({ event: 'c', handler: h }); }",
                    errors: [{ messageId: "callEnumeration" }],
                },
            ],
            valid: [
                { code: "function f(){ reg({ id: 'a' }); reg({ id: 'b' }); }" },
                { code: "const ITEMS = [ reg({ id: 'a' }), reg({ id: 'b' }), reg({ id: 'c' }) ];" },
                { code: "function f(){ it('a', fn); it('b', fn); it('c', fn); }" },
                {
                    code: "function f(el){ el.setAttribute('a', '1'); el.setAttribute('b', '2'); el.setAttribute('c', '3'); }",
                },
                { code: "function f(arr){ arr.push(1); arr.push(2); arr.push(3); }" },
            ],
        }),
    ).toBeGreaterThan(0);
});
