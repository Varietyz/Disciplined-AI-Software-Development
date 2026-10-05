import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/closure-types-centralized.eslint.rule.ts";
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

const idsFor = function idsFor(file: string): string[] {
    return linter
        .verify("const a = 1;", config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("closure-types-centralized", () => {
    it("reports a types file outside the declared bucket", () => {
        expect(idsFor(`${MEMBER}/core/registries/probe.types.ts`)).toStrictEqual(["misplacedTypesFile"]);
    });

    it("accepts a types file inside the bucket", () => {
        expect(idsFor(`${MEMBER}/types/probe.types.ts`)).toStrictEqual([]);
    });

    it("ignores a file that carries no types tag", () => {
        expect(idsFor(`${MEMBER}/core/registries/probe.registry.ts`)).toStrictEqual([]);
    });
});
