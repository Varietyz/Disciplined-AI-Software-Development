import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/no-inline-icon-options.eslint.rule.ts";
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

const SHAPE = 'const glyph = { viewBox: "0 0 24 24", children: [] };';

const idsFor = function idsFor(code: string, file = SRC): string[] {
    return linter
        .verify(code, config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("no-inline-icon-options", () => {
    it("reports an object carrying the declarative asset signature", () => {
        expect(idsFor(SHAPE)).toStrictEqual(["inlineIconOpts"]);
    });

    it("accepts an object holding only one of the signature keys", () => {
        expect(idsFor('const glyph = { viewBox: "0 0 24 24" };')).toStrictEqual([]);
        expect(idsFor("const glyph = { children: [] };")).toStrictEqual([]);
    });

    it("accepts an unrelated object", () => {
        expect(idsFor('const record = { id: "a", label: "b" };')).toStrictEqual([]);
    });

    it("does not fire inside the module declared for the concern", () => {
        expect(idsFor(SHAPE, `${MEMBER}/core/icons/probe.icons.ts`)).toStrictEqual([]);
    });

    it("does not fire in a test file", () => {
        expect(idsFor(SHAPE, `${MEMBER}/probe.test.ts`)).toStrictEqual([]);
    });
});
