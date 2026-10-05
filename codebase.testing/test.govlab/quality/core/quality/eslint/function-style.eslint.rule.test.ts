import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import rule from "@govlab/quality/core/quality/eslint/function-style.eslint.rule.ts";
import tsParser from "@typescript-eslint/parser";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

const runTypedCases = function runTypedCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, parser: tsParser, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("function-style converts declarations to named expressions, preserving async/generator/export", () => {
    expect(
        runCases("function-style", rule, {
            invalid: [
                {
                    code: "function foo() { return 1; }",
                    errors: [{ messageId: "expression" }],
                    output: "const foo = function foo() { return 1; };",
                },
                {
                    code: "async function bar() { return 1; }",
                    errors: [{ messageId: "expression" }],
                    output: "const bar = async function bar() { return 1; };",
                },
                {
                    code: "function* gen() { yield 1; }",
                    errors: [{ messageId: "expression" }],
                    output: "const gen = function* gen() { yield 1; };",
                },
                {
                    code: "export function baz() { return 1; }",
                    errors: [{ messageId: "expression" }],
                    output: "export const baz = function baz() { return 1; };",
                },
            ],
            valid: [
                "const f = function f() {};",
                "const g = () => 1;",
                "const o = { m() {} };",
                "export default function d() {}",
            ],
        }),
    ).toBeGreaterThan(0);
});

test("function-style reports but does NOT fix a declaration used before its definition (hoisting)", () => {
    expect(
        runCases("function-style", rule, {
            invalid: [{ code: "run(); function run() {}", errors: [{ messageId: "expression" }], output: null }],
            valid: [],
        }),
    ).toBeGreaterThan(0);
});

test("function-style does not flag the implementation of an overloaded function (must stay a declaration)", () => {
    const overloaded = [
        "function exec(a: string): string;",
        "function exec(a: number): number;",
        "function exec(a: unknown): unknown { return a; }",
    ].join("\n");
    expect(
        runTypedCases("function-style", rule, {
            invalid: [
                {
                    code: "function plain(a: number): number { return a; }",
                    errors: [{ messageId: "expression" }],
                    output: "const plain = function plain(a: number): number { return a; };",
                },
            ],
            valid: [overloaded],
        }),
    ).toBeGreaterThan(0);
});
