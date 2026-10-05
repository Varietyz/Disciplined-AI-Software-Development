import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import retiredCollectionId from "@ssot/govlab/rules/eslint/retired-collection-id.eslint.rule.ts";
import { sep } from "node:path";

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "retired-collection-id": retiredCollectionId } } },
    rules: { "local/retired-collection-id": "error" },
};

const FILE = `${absolutePath("app.member").split(sep).join("/")}/core/converters/record.converter.ts`;
const SLOT = ["$", "{id}"].join("");

const lint = function lint(code: string): Linter.LintMessage[] {
    return linter.verify(code, config, { filename: FILE });
};

const fixed = function fixed(code: string): string {
    return linter.verifyAndFix(code, config, { filename: FILE }).output;
};

describe("retired-collection-id", () => {
    it("fires on a reference, an anchor, a catalog path and a collection name that use a retired id", () => {
        expect(lint(`export const A = "arch:single-responsibility";`)[0]?.messageId).toBe("retiredCollectionId");
        expect(lint(`export const B = "/ontology#lex-yagni";`)).toHaveLength(1);
        expect(lint(`export const C = "/json/records/algo/x";`)).toHaveLength(1);
        expect(lint(`export const D = "The reason collection holds the loop.";`)).toHaveLength(1);
    });

    it("rewrites a literal and a template quasi in place, keeping every other character", () => {
        expect(fixed(`export const A = "arch:single-responsibility";`)).toBe(
            `export const A = "architecture:single-responsibility";`,
        );
        expect(fixed(`export const B = \`arch-category:${SLOT} and lex:x\`;`)).toBe(
            `export const B = \`architecture-category:${SLOT} and lexicon:x\`;`,
        );
    });

    it("leaves a current id, an ordinary word and a code folder name alone", () => {
        const code = [
            `export const A = "architecture:single-responsibility";`,
            `export const B = "The reason is simple, and the search takes a lexeme.";`,
            `export const C = "src/arch/index.ts";`,
            `export const D = "arch";`,
        ].join("\n");
        expect(lint(code)).toHaveLength(0);
    });
});
