import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/closure-tests-centralized.eslint.rule.ts";
import { sep } from "node:path";

const linter = new Linter();
const config = [
    {
        files: ["**/*.ts"],
        languageOptions: { ecmaVersion: 2025 as const, sourceType: "module" as const },
        plugins: { t: { rules: { r: rule } } },
        rules: { "t/r": "error" as const },
    },
];

const MEMBER = absolutePath("app.member").split(sep).join("/");
const TESTS = absolutePath("codebase.testing").split(sep).join("/");

const idsFor = function idsFor(file: string): string[] {
    return linter
        .verify("const a = 1;", config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("closure-tests-centralized", () => {
    it("reports a test sitting beside its subject", () => {
        expect(idsFor(`${MEMBER}/core/registries/probe.registry.test.ts`)).toStrictEqual(["misplacedTestFile"]);
    });

    it("reports a spec file the same way", () => {
        expect(idsFor(`${MEMBER}/core/registries/probe.registry.spec.ts`)).toStrictEqual(["misplacedTestFile"]);
    });

    it("reports a test inside a member that ships its own test folder", () => {
        const coordination = absolutePath("app.coordination").split(sep).join("/");
        expect(idsFor(`${coordination}/tests/core/steps/probe.step.test.ts`)).toStrictEqual(["misplacedTestFile"]);
    });

    it("accepts a test under the centralized test root", () => {
        expect(idsFor(`${TESTS}/test.rules/eslint/tests/probe.test.ts`)).toStrictEqual([]);
    });

    it("ignores a file that is not a test", () => {
        expect(idsFor(`${MEMBER}/core/registries/probe.registry.ts`)).toStrictEqual([]);
    });
});
