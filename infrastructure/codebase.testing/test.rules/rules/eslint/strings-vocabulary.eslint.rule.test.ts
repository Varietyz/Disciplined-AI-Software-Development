import { describe, expect, it } from "vitest";
import { firstKnownIn, replaceKnown } from "@ssot/govlab/shared/matchers/vocabulary.matcher.ts";
import { Linter } from "eslint";
import stringsVocabulary from "@ssot/govlab/rules/eslint/strings-vocabulary.eslint.rule.ts";

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "strings-vocabulary": stringsVocabulary } } },
    rules: { "local/strings-vocabulary": "error" },
};

const STRINGS_FILE = "src/page.strings.ts";
const OTHER_FILE = "src/element.factory.ts";
const SLOT = ["$", "{a}"].join("");

const lint = function lint(code: string, filename: string): Linter.LintMessage[] {
    return linter.verify(code, config, { filename });
};

describe("strings-vocabulary", () => {
    it("fires on a banned term in a string literal of a strings module", () => {
        const msgs = lint(`export const X = "A robust plan.";`, STRINGS_FILE);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("bannedTerm");
    });

    it("fires on a banned term inside a template quasi", () => {
        const msgs = lint(`export const X = \`A ${SLOT} paradigm shift\`;`, STRINGS_FILE);
        expect(msgs).toHaveLength(1);
    });

    it("matches at word boundaries only", () => {
        expect(lint(`export const X = "A novelty and a leadership role.";`, STRINGS_FILE)).toHaveLength(0);
    });

    it("does not hold a code sample to the registry, inline or through a module-local const", () => {
        const code = [
            `const SAMPLE = "a robust sample";`,
            `export const B = { code: SAMPLE, kind: "code" };`,
            `export const C = { code: "an advanced sample", kind: "code" };`,
        ].join("\n");
        expect(lint(code, STRINGS_FILE)).toHaveLength(0);
    });

    it("fires on a retired synonym whose replacement is not a drop-in, without fixing it", () => {
        const msgs = lint(`export const X = "Add a positive control.";`, STRINGS_FILE);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("retiredSynonym");
        expect(msgs[0]?.fix).toBeUndefined();
    });

    it("passes the canonical term the synonym registry points at", () => {
        expect(
            lint(`export const X = "A planted violation fails; a conforming member passes.";`, STRINGS_FILE),
        ).toHaveLength(0);
    });

    it("fixes every known violation in place, at word boundaries, keeping the leading capital", () => {
        const source = `export const X = "The AI read the operator's plan, a person agreed, and the user's proof of firing held.";`;
        const fixed = linter.verifyAndFix(source, config, { filename: STRINGS_FILE });
        expect(fixed.output).toBe(
            `export const X = "The model read the developer's plan, a developer agreed, and the developer's planted violation held.";`,
        );
        expect(fixed.messages).toHaveLength(0);
    });

    it("replaces the longest known phrase first and only at word boundaries", () => {
        const known = new Map([
            ["the ai", "the model"],
            ["the ai agent", "the agent"],
        ]);
        expect(replaceKnown("The AI agent asked the AIs; the ai answered.", known)).toBe(
            "The agent asked the AIs; the model answered.",
        );
    });

    it("leaves a word that only contains a known phrase alone", () => {
        expect(lint(`export const X = "The AIs and the users of the product.";`, STRINGS_FILE)).toHaveLength(0);
    });

    it("leaves a proper name alone even when it contains a known phrase", () => {
        expect(lint(`export const X = "Reads the operator profile's principles.";`, STRINGS_FILE)).toHaveLength(0);
        expect(firstKnownIn("the operator profile and the operator", ["the operator"], ["the operator profile"])).toBe(
            "the operator",
        );
        expect(
            replaceKnown("The operator profile names the operator.", new Map([["the operator", "the developer"]]), [
                "the operator profile",
            ]),
        ).toBe("The operator profile names the developer.");
    });

    it("keeps the legal parties of a legal document", () => {
        expect(
            lint(`export const X = "The operator of the site is responsible.";`, "src/terms.strings.ts"),
        ).toHaveLength(0);
    });

    it("stays silent outside a strings module", () => {
        expect(lint(`const X = "A robust plan.";`, OTHER_FILE)).toHaveLength(0);
    });
});
