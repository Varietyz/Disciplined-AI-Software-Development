import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import noAsyncTestWithoutAwait from "@govlab/quality/core/quality/eslint/no-async-test-without-await.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};
const TEST_FILE = "example.test.ts";

test("no-async-test-without-await normalizes value-returning async test functions with no await and leaves promise-delegations, awaiting bodies, and non-test files alone", () => {
    expect(
        runCases("no-async-test-without-await", noAsyncTestWithoutAwait, {
            invalid: [
                {
                    code: "const x = async () => null;",
                    errors: [{ messageId: "asyncStubNeedsAwait" }],
                    filename: TEST_FILE,
                    output: "const x = async () => { await Promise.resolve(); return (null); };",
                },
                {
                    code: "const x = async () => ({ id: 1 });",
                    errors: [{ messageId: "asyncStubNeedsAwait" }],
                    filename: TEST_FILE,
                    output: "const x = async () => { await Promise.resolve(); return ({ id: 1 }); };",
                },
                {
                    code: "const x = async () => [];",
                    errors: [{ messageId: "asyncStubNeedsAwait" }],
                    filename: TEST_FILE,
                    output: "const x = async () => { await Promise.resolve(); return ([]); };",
                },
                {
                    code: "const x = async (a) => { use(a); return { id: 1 }; };",
                    errors: [{ messageId: "asyncStubNeedsAwait" }],
                    filename: TEST_FILE,
                    output: "const x = async (a) => { await Promise.resolve(); use(a); return { id: 1 }; };",
                },
                {
                    code: "const x = async () => { record(); };",
                    errors: [{ messageId: "asyncStubNeedsAwait" }],
                    filename: TEST_FILE,
                    output: "const x = async () => { await Promise.resolve(); record(); };",
                },
                {
                    code: 'const x = async () => { throw new Error("offline"); };',
                    errors: [{ messageId: "asyncStubNeedsAwait" }],
                    filename: TEST_FILE,
                    output: 'const x = async () => { await Promise.resolve(); throw new Error("offline"); };',
                },
                {
                    code: "const x = async () => a ?? null;",
                    errors: [{ messageId: "asyncStubNeedsAwait" }],
                    filename: TEST_FILE,
                    output: "const x = async () => { await Promise.resolve(); return (a ?? null); };",
                },
            ],
            valid: [
                { code: "const x = async () => fetchThing();", filename: TEST_FILE },
                { code: "const x = async () => a ?? build();", filename: TEST_FILE },
                { code: "const x = async () => { return build(); };", filename: TEST_FILE },
                { code: "const x = async () => { await go(); return 1; };", filename: TEST_FILE },
                { code: "const x = () => null;", filename: TEST_FILE },
                { code: "const x = async () => null;", filename: "src/production.ts" },
            ],
        }),
    ).toBeGreaterThan(0);
});
