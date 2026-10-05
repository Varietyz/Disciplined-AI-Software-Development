import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import stringsLinkConstruction from "@ssot/govlab/rules/eslint/strings-link-construction.eslint.rule.ts";

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "strings-link-construction": stringsLinkConstruction } } },
    rules: { "local/strings-link-construction": "error" },
};

const STRINGS_FILE = "src/page.strings.ts";
const OTHER_FILE = "src/element.factory.ts";
const HELPER = ["$", "{tabLink(PAGE, TAB)}"].join("");

const lint = function lint(code: string, filename: string): Linter.LintMessage[] {
    return linter.verify(code, config, { filename });
};

describe("strings-link-construction", () => {
    it("accepts an href whose value comes from a template expression", () => {
        expect(lint(`export const X = \`See <a href="${HELPER}">limits</a>.\`;`, STRINGS_FILE)).toHaveLength(0);
    });

    it("fires on an href whose value is written in a template quasi", () => {
        const msgs = lint(`export const X = \`See <a href="/ontology#architecture-x">x</a>.\`;`, STRINGS_FILE);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("handBuiltHref");
    });

    it("fires on a written value in a plain literal, in either quote", () => {
        const code = [
            `export const A = "<a href='/faq'>FAQ</a>";`,
            `export const B = '<a href="#setup">setup</a>';`,
        ].join("\n");
        expect(lint(code, STRINGS_FILE)).toHaveLength(2);
    });

    it("stays silent outside a strings module", () => {
        expect(lint(`const X = '<a href="/faq">FAQ</a>';`, OTHER_FILE)).toHaveLength(0);
    });
});
