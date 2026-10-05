import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/closure-no-business-inheritance.eslint.rule.ts";
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
const SRC = `${MEMBER}/domain/models/probe.model.ts`;

const idsFor = function idsFor(code: string, file = SRC): string[] {
    return linter
        .verify(code, config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("closure-no-business-inheritance", () => {
    it("reports extending a non-foundational class", () => {
        expect(idsFor("class Order extends Invoice {}")).toStrictEqual(["businessInheritance"]);
    });

    it("reports the same shape in a class expression", () => {
        expect(idsFor("const Order = class extends Invoice {};")).toStrictEqual(["businessInheritance"]);
    });

    it("accepts extending a foundational base", () => {
        expect(idsFor("class Order extends BaseRecord {}")).toStrictEqual([]);
    });

    it("accepts extending a language built-in", () => {
        expect(idsFor("class Failure extends Error {}")).toStrictEqual([]);
        expect(idsFor("class Index extends Map {}")).toStrictEqual([]);
    });

    it("accepts a class that extends nothing", () => {
        expect(idsFor("class Order {}")).toStrictEqual([]);
    });

    it("does not fire inside the foundation folder", () => {
        expect(idsFor("class Order extends Invoice {}", `${MEMBER}/core/base/probe.model.ts`)).toStrictEqual([]);
    });
});
