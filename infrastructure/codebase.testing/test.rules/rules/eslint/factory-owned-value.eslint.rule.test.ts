import { describe, expect, it } from "vitest";
import { FACTORY_OWNED_TYPES } from "@ssot/govlab/shared/manifests/invariant.manifest.ts";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/factory-owned-value.eslint.rule.ts";
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

const SRC = `${absolutePath("govlab.patterns").split(sep).join("/")}/core/factories/probe.factory.ts`;

const idsFor = function idsFor(code: string): string[] {
    return linter
        .verify(code, config, SRC)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

const [entry] = [...FACTORY_OWNED_TYPES];
const [typeName, factory] = entry ?? ["", ""];

describe("factory-owned-value", () => {
    it("reports an object literal cast as a factory-owned type", () => {
        expect(idsFor(`const value = { a: 1 } as ${typeName};`)).toStrictEqual(["literal"]);
    });

    it("reports an object literal assigned to a binding typed as a factory-owned type", () => {
        expect(idsFor(`const value: ${typeName} = { a: 1 };`)).toStrictEqual(["literal"]);
    });

    it("accepts a value built through the factory", () => {
        expect(idsFor(`const value: ${typeName} = ${factory}(input);`)).toStrictEqual([]);
    });

    it("accepts the literal inside the module that declares the factory", () => {
        const code = `export const ${factory} = function ${factory}(input: Input): ${typeName} { return { a: 1 } as ${typeName}; };`;
        expect(idsFor(code)).toStrictEqual([]);
    });

    it("ignores a type the registry does not classify", () => {
        expect(idsFor("const value = { a: 1 } as Unregistered;")).toStrictEqual([]);
    });
});
