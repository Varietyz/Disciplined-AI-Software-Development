import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import rule from "@ssot/govlab/rules/eslint/closure-discriminated-union-must-be-exhaustive.eslint.rule.ts";

const linter = new Linter();
const config = [
    {
        files: ["**/*.ts"],
        languageOptions: { ecmaVersion: 2025 as const, sourceType: "module" as const },
        plugins: { t: { rules: { r: rule } } },
        rules: { "t/r": "error" as const },
    },
];

const SRC = "domain/policies/base.policy.ts";

const CHAIN = `if (shape.kind === "a") { one(); }
else if (shape.kind === "b") { two(); }
else if (shape.kind === "c") { three(); }`;

const idsFor = function idsFor(code: string, file = SRC): string[] {
    return linter
        .verify(code, config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("closure-discriminated-union-must-be-exhaustive", () => {
    it("reports a discriminator chain with no terminal arm", () => {
        expect(idsFor(CHAIN)).toStrictEqual(["notExhaustive"]);
    });

    it("reports a chain whose final else does nothing exhaustive", () => {
        expect(idsFor(`${CHAIN} else { fallback(); }`)).toStrictEqual(["notExhaustive"]);
    });

    it("accepts a chain terminated by a throw", () => {
        expect(idsFor(`${CHAIN} else { throw new Error("unreachable"); }`)).toStrictEqual([]);
    });

    it("accepts a chain terminated by a never-typed assertion call", () => {
        expect(idsFor(`${CHAIN} else { assertNever(shape.kind); }`)).toStrictEqual([]);
    });

    it("ignores a chain shorter than the threshold", () => {
        const short = `if (shape.kind === "a") { one(); } else if (shape.kind === "b") { two(); }`;
        expect(idsFor(short)).toStrictEqual([]);
    });

    it("ignores a chain that is not switching on one discriminator", () => {
        const mixed = `if (a === 1) { one(); } else if (b === 2) { two(); } else if (c === 3) { three(); }`;
        expect(idsFor(mixed)).toStrictEqual([]);
    });

    it("does not fire in a test file", () => {
        expect(idsFor(CHAIN, "probe.test.ts")).toStrictEqual([]);
    });
});
