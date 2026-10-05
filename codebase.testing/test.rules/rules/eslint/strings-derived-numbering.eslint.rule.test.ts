import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { NUMBERED_NOUNS } from "@ssot/govlab/shared/manifests/vocabulary.manifest.ts";
import stringsDerivedNumbering from "@ssot/govlab/rules/eslint/strings-derived-numbering.eslint.rule.ts";

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "strings-derived-numbering": stringsDerivedNumbering } } },
    rules: { "local/strings-derived-numbering": "error" },
};

const STRINGS_FILE = "src/page.strings.ts";
const OTHER_FILE = "src/element.factory.ts";
const SLOT = ["$", "{a}"].join("");

const lint = function lint(code: string, filename: string): Linter.LintMessage[] {
    return linter.verify(code, config, { filename });
};

describe("strings-derived-numbering", () => {
    it("holds every noun in lower case so the match reaches it", () => {
        for (const noun of NUMBERED_NOUNS) {
            expect(noun).toBe(noun.toLowerCase());
        }
    });

    it("fires on a captioned part numbered by hand, in any case", () => {
        const msgs = lint(`export const X = "Figure 2 shows the order of the steps.";`, STRINGS_FILE);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("handNumbered");
        expect(msgs[0]?.message).toContain("'Figure 2'");
    });

    it("fires inside a template quasi", () => {
        expect(lint(`export const X = \`As ${SLOT} shows in section 4.\`;`, STRINGS_FILE)).toHaveLength(1);
    });

    it("stays silent on a caption cited by name, a number that is not a part's, and a word that only contains a noun", () => {
        const code = [
            `export const A = "As shown in <cite>the model</cite>, two sections follow.";`,
            `export const B = "The check ran 3 times.";`,
            `export const C = "Subsection 2 of the draft.";`,
        ].join("\n");
        expect(lint(code, STRINGS_FILE)).toHaveLength(0);
    });

    it("stays silent outside a strings module", () => {
        expect(lint(`const X = "Figure 2";`, OTHER_FILE)).toHaveLength(0);
    });
});
