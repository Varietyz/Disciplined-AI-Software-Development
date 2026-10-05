import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/require-self-registration.eslint.rule.ts";
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

const idsFor = function idsFor(code: string, file: string): string[] {
    return linter
        .verify(code, config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("require-self-registration", () => {
    it("is inert where no folder holds a glob barrel, so no surface is derived", () => {
        const file = `${MEMBER}/domain/policies/probe.policy.ts`;
        expect(idsFor("export const policy = {};", file)).toStrictEqual([]);
    });

    it("does not fire on a barrel file itself", () => {
        const file = `${MEMBER}/domain/policies/policies.barrel.ts`;
        expect(idsFor('const all = import.meta.glob("./*.policy.ts");', file)).toStrictEqual([]);
    });

    it("does not fire on an infrastructure concern, which cannot register its own registration", () => {
        for (const concern of ["registry", "types", "constants", "schema", "ids"]) {
            const file = `${MEMBER}/domain/policies/probe.${concern}.ts`;
            expect(idsFor("export const value = 1;", file)).toStrictEqual([]);
        }
    });

    it("does not fire on a test file, which the taxonomy marks name-exempt", () => {
        const file = `${MEMBER}/domain/policies/probe.policy.test.ts`;
        expect(idsFor("export const policy = {};", file)).toStrictEqual([]);
    });
});
