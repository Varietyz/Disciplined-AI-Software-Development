import { describe, expect, it } from "vitest";
import { eslintRuleEntries, stylelintRules } from "@govlab/quality/core/converters/rule.converter.ts";

const create = (): Record<string, never> => ({});

describe("rule converters", () => {
    it("pairs each eslint rule with its id and refuses a file that exports no rule", () => {
        const rule = { create, meta: {} };
        expect(eslintRuleEntries([{ file: "a.ts", id: "no-x", module: { default: rule } }])).toStrictEqual([
            ["no-x", rule],
        ]);
        expect(() => eslintRuleEntries([{ file: "b.ts", id: "no-y", module: {} }])).toThrow("b.ts");
    });

    it("reads a stylelint plugin with its meta and refuses one without", () => {
        const plugin = { rule: create, ruleName: "govlab/x" };
        const meta = { meta: { canonical: [], description: "d", fixable: false }, ruleId: "x", ruleName: "govlab/x" };
        expect(stylelintRules([{ file: "a.ts", id: "x", module: { RULE_META: meta, default: plugin } }])).toStrictEqual(
            [{ meta, plugin }],
        );
        expect(() => stylelintRules([{ file: "b.ts", id: "y", module: { default: plugin } }])).toThrow("b.ts");
    });
});
