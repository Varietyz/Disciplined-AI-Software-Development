import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/closure-no-double-cast.eslint.rule.ts";
import { sep } from "node:path";

const linter = new Linter();
const config = [
    {
        files: ["**/*.ts"],
        languageOptions: {
            ecmaVersion: 2025 as const,
            parser: await import("@typescript-eslint/parser"),
            sourceType: "module" as const,
        },
        plugins: { t: { rules: { r: rule } } },
        rules: { "t/r": "error" as const },
    },
];

const SRC = `${absolutePath("app.member").split(sep).join("/")}/core/registries/probe.registry.ts`;

const idsFor = function idsFor(code: string, file = SRC): string[] {
    return linter
        .verify(code, config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("closure-no-double-cast", () => {
    it("reports a cast laundered through unknown", () => {
        expect(idsFor("const a = value as unknown as Widget;")).toStrictEqual(["doubleCast"]);
    });

    it("accepts a single assertion", () => {
        expect(idsFor("const a = value as Widget;")).toStrictEqual([]);
    });

    it("accepts a cast to unknown alone", () => {
        expect(idsFor("const a = value as unknown;")).toStrictEqual([]);
    });

    it("does not fire in a test file", () => {
        expect(idsFor("const a = value as unknown as Widget;", "probe.test.ts")).toStrictEqual([]);
    });
});
