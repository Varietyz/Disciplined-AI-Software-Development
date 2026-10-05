import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import centralizedStrings from "@ssot/govlab/rules/eslint/centralized-strings.eslint.rule.ts";

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "centralized-strings": centralizedStrings } } },
    rules: { "local/centralized-strings": "error" },
};

const MEMBER = "banes-lab.web";
const DECLARED = `${MEMBER}/configuration/strings`;

const lint = function lint(code: string, filename: string): Linter.LintMessage[] {
    return linter.verify(code, config, { filename });
};

describe("centralized-strings", () => {
    it("fires on a strings file in a domain concern folder", () => {
        const msgs = lint(`export const X = "test";`, `${MEMBER}/domain/models/base.strings.ts`);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("misplacedStringsFile");
    });

    it("fires on a strings file in a runtime concern folder", () => {
        const msgs = lint(`export const Y = "test";`, `${MEMBER}/runtime/entrypoints/base.strings.ts`);
        expect(msgs).toHaveLength(1);
    });

    it("does NOT fire on a strings file in the declared strings folder", () => {
        const msgs = lint(`export const Z = "test";`, `${DECLARED}/base.strings.ts`);
        expect(msgs).toHaveLength(0);
    });

    it("does NOT fire on a .ts file that does not carry the strings tag", () => {
        const msgs = lint(`export const A = "test";`, `${MEMBER}/domain/models/base.model.ts`);
        expect(msgs).toHaveLength(0);
    });

    it("does NOT fire on an ids file, which is a different surface", () => {
        const msgs = lint(`export const ID_FOO = "foo";`, `${MEMBER}/core/registries/base.ids.ts`);
        expect(msgs).toHaveLength(0);
    });

    it("handles windows path separators", () => {
        const msgs = lint(`export const X = "test";`, String.raw`banes-lab.web\domain\models\base.strings.ts`);
        expect(msgs).toHaveLength(1);
    });

    it("recognizes the declared strings folder with windows path separators", () => {
        const msgs = lint(`export const X = "test";`, String.raw`banes-lab.web\configuration\strings\base.strings.ts`);
        expect(msgs).toHaveLength(0);
    });

    it("fires on a strings file in an undeclared folder", () => {
        const msgs = lint(`export const X = "test";`, `${MEMBER}/somewhere/base.strings.ts`);
        expect(msgs).toHaveLength(1);
    });
});
