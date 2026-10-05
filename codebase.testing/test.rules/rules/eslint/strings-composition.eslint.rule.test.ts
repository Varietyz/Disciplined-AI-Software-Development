import {
    STRINGS_CHANNEL,
    WRITING_CANON,
    isCheckEnforced,
} from "@ssot/govlab/shared/manifests/writing.canon.manifest.ts";
import { describe, expect, it } from "vitest";
import { CHECK_BY_KIND } from "@ssot/govlab/shared/manifests/composition.manifest.ts";
import { Linter } from "eslint";
import stringsComposition from "@ssot/govlab/rules/eslint/strings-composition.eslint.rule.ts";

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "strings-composition": stringsComposition } } },
    rules: { "local/strings-composition": "error" },
};

const STRINGS_FILE = "src/page.strings.ts";
const OTHER_FILE = "src/element.factory.ts";

const lint = function lint(code: string, filename = STRINGS_FILE): Linter.LintMessage[] {
    return linter.verify(code, config, { filename });
};

const idsOf = function idsOf(messages: readonly Linter.LintMessage[]): (string | undefined)[] {
    return messages.map((message) => message.messageId);
};

const canonChecks = WRITING_CANON.flatMap((layer) => layer.rules.flatMap((rule) => rule.checks));

describe("strings-composition", () => {
    it("reports a sentence that comments on the one before it", () => {
        const messages = lint(
            `export const X = "A fix converges, so applying it twice changes nothing. That is idempotency.";`,
        );
        expect(idsOf(messages)).toStrictEqual(["commentOnPrevious"]);
    });

    it("accepts the same fact with the term inside the claim", () => {
        expect(lint(`export const X = "Healing has idempotency: running it twice changes nothing.";`)).toHaveLength(0);
    });

    it("reports a phrase that announces instead of informing, but not inside a quoted reply", () => {
        expect(idsOf(lint(`export const X = "It is worth noting that the gate runs once per state.";`))).toStrictEqual([
            "fillerPhrase",
        ]);
        expect(
            lint(`export const X = "Asked late, it reads <em>done, note that I assumed the second shape</em>.";`),
        ).toHaveLength(0);
    });

    it("reports a sentence that repeats an earlier one nearly word for word", () => {
        const messages = lint(
            `export const X = "Every check writes its report to disk after every run. After every run, every check writes its report to disk.";`,
        );
        expect(idsOf(messages)).toStrictEqual(["restatement"]);
    });

    it("accepts two sentences that share words but carry different facts", () => {
        expect(
            lint(
                `export const X = "A word also matches its longer forms. A longer word also forgives one slip of spelling.";`,
            ),
        ).toHaveLength(0);
    });

    it("reports a lesson field that repeats another field of the same lesson", () => {
        const code = `export const L = { application: "Give every refused construct its required replacement, with the debt it borrows and the leverage it buys.", kind: "lesson", principle: "A refused construct carries the debt it borrows, and its required replacement carries the leverage it buys." };`;
        expect(idsOf(lint(code))).toStrictEqual(["fieldRestatement"]);
    });

    it("reports an action given to an unnamed actor, and accepts the named party", () => {
        expect(
            idsOf(lint(`export const X = "A claim about the tree is a lie until someone reads the tree.";`)),
        ).toStrictEqual(["namedParty"]);
        expect(
            lint(
                `export const X = "A claim about the tree is settled only when the model or the developer reads the tree.";`,
            ),
        ).toHaveLength(0);
    });

    it("does not hold a code sample or a non-strings module to the policy", () => {
        expect(lint(`export const C = { code: "Run it. That is the test.", kind: "code" };`)).toHaveLength(0);
        expect(lint(`const X = "Run it. That is the test.";`, OTHER_FILE)).toHaveLength(0);
    });

    it("enforces every shape the canon marks as checkable, and leaves the review shapes to review", () => {
        expect([...CHECK_BY_KIND.values()].every((id) => isCheckEnforced(id, STRINGS_CHANNEL))).toBe(true);
        expect(
            canonChecks.filter((check) => check.detection === "review").some((check) => check.enforcedIn.length > 0),
        ).toBe(false);
    });
});
