import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/closure-no-inline-exported-types.eslint.rule.ts";
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

const MEMBER = absolutePath("app.member").split(sep).join("/");
const SRC = `${MEMBER}/core/registries/probe.registry.ts`;

const idsFor = function idsFor(code: string, file = SRC): string[] {
    return linter
        .verify(code, config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("closure-no-inline-exported-types", () => {
    it("reports an exported interface outside the type bucket", () => {
        expect(idsFor("export interface Shape { id: string }")).toStrictEqual(["inlineExportedInterface"]);
    });

    it("reports an exported type alias outside the type bucket", () => {
        expect(idsFor("export type Shape = { id: string };")).toStrictEqual(["inlineExportedTypeAlias"]);
    });

    it("accepts a file-local type that is not exported", () => {
        expect(idsFor("interface Shape { id: string }\nconst x: Shape = { id: 'a' };")).toStrictEqual([]);
    });

    it("accepts an exported runtime value", () => {
        expect(idsFor("export const shape = { id: 'a' };")).toStrictEqual([]);
    });

    it("does not fire inside a types file", () => {
        expect(idsFor("export interface Shape { id: string }", `${MEMBER}/types/probe.types.ts`)).toStrictEqual([]);
    });
});
