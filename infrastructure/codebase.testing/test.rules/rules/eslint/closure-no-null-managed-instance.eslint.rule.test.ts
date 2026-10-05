import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/closure-no-null-managed-instance.eslint.rule.ts";
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

describe("closure-no-null-managed-instance", () => {
    it("reports null typed as a managed collaborator", () => {
        expect(idsFor("const bus = null as BaseRegistry;")).toStrictEqual(["nullManaged"]);
    });

    it("reports the same injection laundered through unknown", () => {
        expect(idsFor("const bus = null as unknown as BaseRegistry;")).toStrictEqual(["nullManaged"]);
    });

    it("accepts null typed as a name no concern tag covers", () => {
        expect(idsFor("const value = null as Invoice;")).toStrictEqual([]);
    });

    it("accepts a non-null value cast to a managed type", () => {
        expect(idsFor("const bus = make() as BaseRegistry;")).toStrictEqual([]);
    });

    it("does not fire in a test file", () => {
        expect(idsFor("const bus = null as BaseRegistry;", "probe.test.ts")).toStrictEqual([]);
    });
});
