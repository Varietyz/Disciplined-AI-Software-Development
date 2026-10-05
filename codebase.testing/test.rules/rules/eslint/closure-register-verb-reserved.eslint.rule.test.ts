import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/closure-register-verb-reserved.eslint.rule.ts";
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
const SRC = `${MEMBER}/core/listeners/probe.listener.ts`;

const idsFor = function idsFor(code: string, file = SRC): string[] {
    return linter
        .verify(code, config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("closure-register-verb-reserved", () => {
    it("reports an exported register* function outside a registry file", () => {
        expect(idsFor("export function registerTicker() {}")).toStrictEqual(["reservedVerb"]);
    });

    it("accepts the same function inside a registry file", () => {
        expect(
            idsFor("export function registerTicker() {}", `${MEMBER}/core/registries/probe.registry.ts`),
        ).toStrictEqual([]);
    });

    it("accepts a non-exported register* function", () => {
        expect(idsFor("function registerTicker() {}")).toStrictEqual([]);
    });

    it("accepts an instance-scoped verb", () => {
        expect(idsFor("export function subscribeTicker() {}")).toStrictEqual([]);
    });

    it("does not fire on a name that merely begins with the letters of the verb", () => {
        expect(idsFor("export function registry() {}")).toStrictEqual([]);
    });

    it("does not fire in a test file", () => {
        expect(idsFor("export function registerTicker() {}", `${MEMBER}/probe.test.ts`)).toStrictEqual([]);
    });
});
