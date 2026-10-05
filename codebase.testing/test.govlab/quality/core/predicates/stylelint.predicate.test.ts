import { expect, test } from "vitest";
import { isStylelintMeta, isStylelintPlugin } from "@govlab/quality/core/predicates/stylelint.predicate.ts";

test("the stylelint guards recognize a plugin object and a govlab rule meta", () => {
    expect(isStylelintPlugin({ rule: (): void => undefined, ruleName: "govlab/x" })).toBe(true);
    expect(isStylelintPlugin({ ruleName: "govlab/x" })).toBe(false);
    expect(isStylelintMeta({ meta: { canonical: [], description: "d" }, ruleId: "x", ruleName: "govlab/x" })).toBe(
        true,
    );
    expect(isStylelintMeta({ ruleId: "x", ruleName: "govlab/x" })).toBe(false);
    expect(isStylelintMeta({ ruleId: "x" })).toBe(false);
});
