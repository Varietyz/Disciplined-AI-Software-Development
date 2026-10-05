import { STRINGS_CHANNEL, isCheckEnforced } from "@ssot/govlab/shared/manifests/writing.canon.manifest.ts";
import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import stringsLessonFields from "@ssot/govlab/rules/eslint/strings-lesson-fields.eslint.rule.ts";

const MOOD_ENFORCED = isCheckEnforced("field-mood", STRINGS_CHANNEL);

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "strings-lesson-fields": stringsLessonFields } } },
    rules: { "local/strings-lesson-fields": "error" },
};

const STRINGS_FILE = "src/methodology.strings.ts";
const HOLE = ["$", "{"].join("");
const OTHER_FILE = "src/methodology.constants.ts";

const lint = function lint(code: string, filename: string): Linter.LintMessage[] {
    return linter.verify(code, config, { filename });
};

const LESSON = `export const L = { kind: "lesson", problem: "p", failureMode: "", cause: "c", principle: "", decision: "d", application: "apply", validation: "v" };`;

describe("strings-lesson-fields", () => {
    it("reports every empty field of a lesson object", () => {
        const msgs = lint(LESSON, STRINGS_FILE);
        expect(msgs).toHaveLength(2);
        expect(msgs.map((msg) => msg.messageId)).toStrictEqual(["emptyField", "emptyField"]);
        expect(msgs[0]?.message).toContain("failureMode");
        expect(msgs[1]?.message).toContain("principle");
    });

    it("ignores an empty field on an object of another kind", () => {
        expect(lint(`export const P = { kind: "paragraph", text: "" };`, STRINGS_FILE)).toHaveLength(0);
    });

    it("passes a lesson whose every field carries content", () => {
        expect(lint(`export const L = { kind: "lesson", problem: "p", cause: "c" };`, STRINGS_FILE)).toHaveLength(0);
    });

    it("reports a field whose opening word contradicts its declared mood exactly when the policy enforces it", () => {
        const code = `export const L = { kind: "lesson", application: "The question is asked first.", principle: "Use one home per fact." };`;
        const msgs = lint(code, STRINGS_FILE);
        const expected = MOOD_ENFORCED ? ["moodMismatch", "moodMismatch"] : [];
        expect(msgs.map((msg) => msg.messageId)).toStrictEqual(expected);
    });

    it("accepts an imperative field opening with the verb and a declarative field opening with its subject", () => {
        const code = `export const L = { kind: "lesson", application: "Ask before the dependent work starts.", principle: "One fact has one home." };`;
        expect(lint(code, STRINGS_FILE)).toHaveLength(0);
    });

    it("holds the decision descriptive: it describes the ruling rather than ordering it", () => {
        const described = `export const L = { kind: "lesson", decision: "The work is partitioned first and counted second." };`;
        const ordered = `export const L = { kind: "lesson", decision: "Split the work before counting it." };`;
        expect(lint(described, STRINGS_FILE)).toHaveLength(0);
        const expected = MOOD_ENFORCED ? ["moodMismatch"] : [];
        expect(lint(ordered, STRINGS_FILE).map((msg) => msg.messageId)).toStrictEqual(expected);
    });

    it("reads a template-literal field through its literal parts", () => {
        const code = `export const L = { kind: "lesson", application: \`The ${HOLE}link} decides.\`, principle: \`One fact has one ${HOLE}home}.\`, cause: \`\` };`;
        const msgs = lint(code, STRINGS_FILE);
        const expected = MOOD_ENFORCED ? ["moodMismatch", "emptyField"] : ["emptyField"];
        expect(msgs.map((msg) => msg.messageId)).toStrictEqual(expected);
    });

    it("accepts a template-literal field that opens with a computed link", () => {
        const code = `export const L = { kind: "lesson", decision: \`${HOLE}link} the boundary first.\`, principle: \`${HOLE}name} holds whole in its own scope.\` };`;
        expect(lint(code, STRINGS_FILE)).toHaveLength(0);
    });

    it("stays silent outside a strings module", () => {
        expect(lint(LESSON, OTHER_FILE)).toHaveLength(0);
    });
});
