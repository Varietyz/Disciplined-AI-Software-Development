import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/closure-show-flag-polarity.eslint.rule.ts";
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
const SRC = `${MEMBER}/domain/policies/probe.policy.ts`;

const idsFor = function idsFor(code: string, file = SRC): string[] {
    return linter
        .verify(code, config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("closure-show-flag-polarity", () => {
    it("reports a show flag read as not-false, which defaults an unset field to shown", () => {
        expect(idsFor("const visible = config.showPanel !== false;")).toStrictEqual(["inversePolarity"]);
    });

    it("reports the loose-equality spelling too", () => {
        expect(idsFor("const visible = config.showPanel != false;")).toStrictEqual(["inversePolarity"]);
    });

    it("reports a show flag defaulted to true", () => {
        expect(idsFor("const visible = config.showPanel ?? true;")).toStrictEqual(["inversePolarity"]);
        expect(idsFor("const visible = config.showPanel || true;")).toStrictEqual(["inversePolarity"]);
    });

    it("accepts the safe reading, where an unset field stays hidden", () => {
        expect(idsFor("const visible = config.showPanel === true;")).toStrictEqual([]);
        expect(idsFor("const visible = config.showPanel ?? false;")).toStrictEqual([]);
    });

    it("does not fire on a field that is not a show flag", () => {
        expect(idsFor("const visible = config.enabled !== false;")).toStrictEqual([]);
    });

    it("does not fire on a name that merely begins with the letters of the verb", () => {
        expect(idsFor("const visible = config.shower !== false;")).toStrictEqual([]);
    });

    it("does not fire in a test file", () => {
        expect(idsFor("const visible = config.showPanel !== false;", `${MEMBER}/probe.test.ts`)).toStrictEqual([]);
    });
});
