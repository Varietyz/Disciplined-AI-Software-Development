import { STRINGS_CHANNEL, isCheckEnforced } from "@ssot/govlab/shared/manifests/writing.canon.manifest.ts";
import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import type { TermRecord } from "@ssot/govlab/types/writing.types.ts";
import stringsTerminology from "@ssot/govlab/rules/eslint/strings-terminology.eslint.rule.ts";

const TERMS: TermRecord[] = [{ canonical: "gate", concept: "gate", synonyms: ["checker", "quality check"] }];

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "strings-terminology": stringsTerminology } } },
    rules: { "local/strings-terminology": ["error", { terms: TERMS }] },
};

const STRINGS_FILE = "src/page.strings.ts";
const OTHER_FILE = "src/element.factory.ts";
const ENFORCED = isCheckEnforced("one-term-per-concept", STRINGS_CHANNEL);

const lint = function lint(code: string, filename: string): Linter.LintMessage[] {
    return linter.verify(code, config, { filename });
};

const countOf = function countOf(enabled: boolean): number {
    return enabled ? 1 : 0;
};

describe("strings-terminology", () => {
    it("reports a retired synonym at a word boundary and names the canonical term", () => {
        const msgs = lint(`export const X = "The checker reports the finding.";`, STRINGS_FILE);
        expect(msgs).toHaveLength(countOf(ENFORCED));
        expect(msgs.every((msg) => msg.messageId === "retiredSynonym" && msg.message.includes("'gate'"))).toBe(true);
    });

    it("reports a multi-word synonym inside a template quasi", () => {
        const slot = ["$", "{a}"].join("");
        const msgs = lint(`export const X = \`Run the quality check ${slot} first\`;`, STRINGS_FILE);
        expect(msgs).toHaveLength(countOf(ENFORCED));
    });

    it("does not match a synonym inside a longer word", () => {
        expect(lint(`export const X = "The checkerboard pattern.";`, STRINGS_FILE)).toHaveLength(0);
    });

    it("does not hold a code sample to the registry", () => {
        expect(lint(`export const C = { code: "checker --fix", kind: "code" };`, STRINGS_FILE)).toHaveLength(0);
    });

    it("stays silent outside a strings module", () => {
        expect(lint(`const X = "The checker reports.";`, OTHER_FILE)).toHaveLength(0);
    });
});
