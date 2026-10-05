import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { PUNCTUATION_POLICY } from "@ssot/govlab/shared/manifests/punctuation.manifest.ts";
import stringsPunctuation from "@ssot/govlab/rules/eslint/strings-punctuation.eslint.rule.ts";

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "strings-punctuation": stringsPunctuation } } },
    rules: { "local/strings-punctuation": "error" },
};

const STRINGS_FILE = "src/page.strings.ts";
const OTHER_FILE = "src/element.factory.ts";
const SLOT = ["$", "{a}"].join("");

const lint = function lint(code: string, filename: string): Linter.LintMessage[] {
    return linter.verify(code, config, { filename });
};

const countOf = function countOf(enabled: boolean): number {
    return enabled ? 1 : 0;
};

describe("strings-punctuation", () => {
    it("reports a digit-form metric beside a unit exactly when the policy enables it", () => {
        const msgs = lint(`export const X = "It settles within 300ms.";`, STRINGS_FILE);
        expect(msgs).toHaveLength(countOf(PUNCTUATION_POLICY.digitMetric));
        expect(msgs.every((msg) => msg.messageId === "digitMetric")).toBe(true);
    });

    it("reports a percent metric inside a template quasi exactly when the policy enables it", () => {
        const msgs = lint(`export const X = \`About ${SLOT} of 40% cases\`;`, STRINGS_FILE);
        expect(msgs).toHaveLength(countOf(PUNCTUATION_POLICY.digitMetric));
    });

    it("reports a long dash exactly when the policy refuses it", () => {
        const msgs = lint(`export const X = "One thing — another.";`, STRINGS_FILE);
        expect(msgs).toHaveLength(countOf(PUNCTUATION_POLICY.longDash));
    });

    it("reports a semicolon exactly when the policy refuses it", () => {
        const msgs = lint(`export const X = "One thing; another.";`, STRINGS_FILE);
        expect(msgs).toHaveLength(countOf(PUNCTUATION_POLICY.semicolon));
    });

    it("does not read a plural word ending in a unit letter as a metric", () => {
        expect(lint(`export const X = "Three gates and two seams.";`, STRINGS_FILE)).toHaveLength(0);
    });

    it("does not hold a code sample to the policy, inline or through a module-local const", () => {
        const code = [
            `const SAMPLE = "Progress: 0%; done — 300ms";`,
            `export const B = { code: SAMPLE, kind: "code" };`,
            `export const C = { code: "Rate: 50%", kind: "code" };`,
        ].join("\n");
        expect(lint(code, STRINGS_FILE)).toHaveLength(0);
    });

    it("stays silent outside a strings module", () => {
        expect(lint(`const X = "300ms; a — b";`, OTHER_FILE)).toHaveLength(0);
    });
});
