import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/closure-no-disable-comments.eslint.rule.ts";
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

const SRC = `${absolutePath("app.member").split(sep).join("/")}/core/registries/probe.registry.ts`;

const idsFor = function idsFor(code: string): string[] {
    return linter
        .verify(code, config, SRC)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("closure-no-disable-comments", () => {
    it("reports an inline lint disable", () => {
        expect(idsFor("// eslint-disable-next-line no-console\nconst a = 1;")).toStrictEqual(["banned"]);
    });

    it("reports a block-scoped disable, which cannot suppress this rule ahead of itself", () => {
        expect(idsFor("/* eslint-disable */\nconst a = 1;\n/* eslint-enable */")).toStrictEqual(["banned"]);
    });

    it("reports a re-enable directive standing alone", () => {
        expect(idsFor("const a = 1;\n/* eslint-enable */")).toStrictEqual(["banned"]);
    });

    it("reports a style-tool disable too", () => {
        expect(idsFor("// stylelint-disable-next-line\nconst a = 1;")).toStrictEqual(["banned"]);
    });

    it("accepts a comment that is not a disable directive", () => {
        expect(idsFor("// a plain note\nconst a = 1;")).toStrictEqual([]);
    });

    it("accepts source with no comments at all", () => {
        expect(idsFor("const a = 1;")).toStrictEqual([]);
    });
});
