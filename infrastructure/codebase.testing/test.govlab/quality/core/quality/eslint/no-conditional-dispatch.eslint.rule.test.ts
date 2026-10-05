import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import noConditionalDispatch from "@govlab/quality/core/quality/eslint/no-conditional-dispatch.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-conditional-dispatch flags an if/else chain dispatching 3+ times on one discriminant vs literals", () => {
    expect(
        runCases("no-conditional-dispatch", noConditionalDispatch, {
            invalid: [
                {
                    code: "function f(k){ if (k === 'a') { x(); } else if (k === 'b') { y(); } else if (k === 'c') { z(); } }",
                    errors: [{ messageId: "conditionalDispatch" }],
                },
                {
                    code: "function esc(ch){ let out = ''; if (ch === '&') { out += '&amp;'; } else if (ch === '<') { out += '&lt;'; } else if (ch === '>') { out += '&gt;'; } else if (ch === '\"') { out += '&quot;'; } return out; }",
                    errors: [{ messageId: "conditionalDispatch" }],
                },
                {
                    code: "function f(t){ if (t.type === 'a') { x(); } else if (t.type === 'b') { y(); } else if (t.type === 'c') { z(); } }",
                    errors: [{ messageId: "conditionalDispatch" }],
                },
            ],
            valid: [
                { code: "function f(k){ if (k === 'a') { x(); } else if (k === 'b') { y(); } }" },
                {
                    code: "function f(a,b,c){ if (a === 1) { x(); } else if (b === 2) { y(); } else if (c === 3) { z(); } }",
                },
                { code: "function f(n){ if (n > 1) { a(); } else if (n > 2) { b(); } else if (n > 3) { c(); } }" },
                { code: "function f(x){ if (!x) { a(); } else if (x.foo) { b(); } else if (x.bar) { c(); } }" },
                {
                    code: "function scan(s){ let d = 0; for (const ch of s){ if (ch === '\"') { inStr = true; } else if (ch === '{') { d += 1; } else if (ch === '}') { d -= 1; if (d === 0) { return d; } } } }",
                },
            ],
        }),
    ).toBeGreaterThan(0);
});
