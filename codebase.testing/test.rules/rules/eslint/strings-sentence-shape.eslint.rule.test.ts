import { STRINGS_CHANNEL, isCheckEnforced } from "@ssot/govlab/shared/manifests/writing.canon.manifest.ts";
import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { SENTENCE_CAP } from "@ssot/govlab/shared/manifests/sentence.manifest.ts";
import stringsSentenceShape from "@ssot/govlab/rules/eslint/strings-sentence-shape.eslint.rule.ts";

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "strings-sentence-shape": stringsSentenceShape } } },
    rules: { "local/strings-sentence-shape": "error" },
};

const STRINGS_FILE = "src/page.strings.ts";
const OTHER_FILE = "src/element.factory.ts";

const lint = function lint(code: string, filename: string): Linter.LintMessage[] {
    return linter.verify(code, config, { filename });
};

const countOf = function countOf(enabled: boolean): number {
    return enabled ? 1 : 0;
};

const longSentence = Array.from({ length: SENTENCE_CAP + 1 }, () => "word").join(" ");

describe("strings-sentence-shape", () => {
    it("reports a sentence over the word cap exactly when the cap is enforced", () => {
        const msgs = lint(`export const X = "${longSentence}.";`, STRINGS_FILE);
        expect(msgs).toHaveLength(countOf(isCheckEnforced("sentence-cap", STRINGS_CHANNEL)));
        expect(msgs.every((msg) => msg.messageId === "overCap")).toBe(true);
    });

    it("accepts a sentence at the cap", () => {
        const atCap = Array.from({ length: SENTENCE_CAP }, () => "word").join(" ");
        expect(lint(`export const X = "${atCap}.";`, STRINGS_FILE)).toHaveLength(0);
    });

    it("reports an agentless passive exactly when the named-agent rule is enforced", () => {
        const msgs = lint(`export const X = "The file is rejected.";`, STRINGS_FILE);
        expect(msgs).toHaveLength(countOf(isCheckEnforced("named-agent", STRINGS_CHANNEL)));
        expect(msgs.every((msg) => msg.messageId === "agentlessPassive")).toBe(true);
    });

    it("accepts a passive that names its agent", () => {
        expect(lint(`export const X = "The file is rejected by the gate.";`, STRINGS_FILE)).toHaveLength(0);
    });

    it("reports a chained instruction exactly when the one-instruction rule is enforced", () => {
        const msgs = lint(`export const X = "Read it and fix it, then run it and ship.";`, STRINGS_FILE);
        expect(msgs).toHaveLength(countOf(isCheckEnforced("one-instruction-per-sentence", STRINGS_CHANNEL)));
        expect(msgs.every((msg) => msg.messageId === "chainedInstructions")).toBe(true);
    });

    it("does not hold a code sample to the policy", () => {
        expect(lint(`export const C = { code: "${longSentence}.", kind: "code" };`, STRINGS_FILE)).toHaveLength(0);
    });

    it("stays silent outside a strings module", () => {
        expect(lint(`const X = "${longSentence}.";`, OTHER_FILE)).toHaveLength(0);
    });
});
