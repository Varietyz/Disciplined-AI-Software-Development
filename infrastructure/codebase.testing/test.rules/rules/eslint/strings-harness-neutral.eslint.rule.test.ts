import { describe, expect, it } from "vitest";
import { HARNESS_TOKENS } from "@ssot/govlab/shared/manifests/vocabulary.manifest.ts";
import { Linter } from "eslint";
import stringsHarnessNeutral from "@ssot/govlab/rules/eslint/strings-harness-neutral.eslint.rule.ts";

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "strings-harness-neutral": stringsHarnessNeutral } } },
    rules: { "local/strings-harness-neutral": "error" },
};

const STRINGS_FILE = "src/page.strings.ts";
const OTHER_FILE = "src/element.factory.ts";
const SLOT = ["$", "{a}"].join("");

const lint = function lint(code: string, filename: string): Linter.LintMessage[] {
    return linter.verify(code, config, { filename });
};

describe("strings-harness-neutral", () => {
    it("holds every registry entry in lower case so the word-boundary match reaches it", () => {
        for (const token of HARNESS_TOKENS) {
            expect(token).toBe(token.toLowerCase());
        }
    });

    it("fires on a harness token in a string literal of a strings module", () => {
        const msgs = lint(`export const X = "Tools of ${HARNESS_TOKENS[0] ?? ""} are invoked here.";`, STRINGS_FILE);
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("harnessToken");
    });

    it("fires inside a code sample, because a sample is where the lock-in lives", () => {
        const code = [
            `const SAMPLE = "TASK prompt WITH subagent_type: explorer";`,
            `export const B = { code: SAMPLE, kind: "code" };`,
        ].join("\n");
        expect(lint(code, STRINGS_FILE)).toHaveLength(1);
    });

    it("fires inside a template quasi", () => {
        const msgs = lint(`export const X = \`Read ${SLOT} from settings.json\`;`, STRINGS_FILE);
        expect(msgs).toHaveLength(1);
    });

    it("matches at word boundaries only", () => {
        expect(lint(`export const X = "A notebook and a subagent are fine.";`, STRINGS_FILE)).toHaveLength(0);
    });

    it("stays silent outside a strings module", () => {
        expect(lint(`const X = "Read it from settings.json";`, OTHER_FILE)).toHaveLength(0);
    });
});
