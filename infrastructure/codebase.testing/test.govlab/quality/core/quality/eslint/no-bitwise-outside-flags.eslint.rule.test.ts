import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/quality/eslint/no-bitwise-outside-flags.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("no-bitwise-outside-flags permits bitfield-enum flag algebra and flags business bitwise", () => {
    expect(
        runCases("no-bitwise-outside-flags", rule, {
            invalid: [
                { code: "const x = a | b;", errors: [{ messageId: "bitwise" }] },
                { code: "const y = value & 3;", errors: [{ messageId: "bitwise" }] },
                { code: "const s = hash << 5;", errors: [{ messageId: "bitwise" }] },
                { code: "let n = 0; n ^= 2;", errors: [{ messageId: "bitwise" }] },
                { code: "const z = ~count;", errors: [{ messageId: "bitwise" }] },
                { code: "const mixed = TypeFormatFlags.A | plain;", errors: [{ messageId: "bitwise" }] },
            ],
            valid: [
                "const F = TypeFormatFlags.NoTruncation | TypeFormatFlags.MultilineObjectLiterals;",
                "const G = api.SymbolFlags.Alias | api.SymbolFlags.Property;",
                "const H = ~NodeFlags.Const;",
                "const chain = ts.TypeFormatFlags.A | ts.TypeFormatFlags.B | ts.TypeFormatFlags.C;",
                "const parity = Math.floor(flags / mask) % 2 === 1;",
            ],
        }),
    ).toBeGreaterThan(0);
});
