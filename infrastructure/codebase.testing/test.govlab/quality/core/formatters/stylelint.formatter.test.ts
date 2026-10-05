import { expect, test } from "vitest";
import { registerCanon } from "@govlab/quality/core/registries/stylelint.registry.ts";
import { withRuleId } from "@govlab/quality/core/formatters/stylelint.formatter.ts";

test("withRuleId appends the rule id alone for a rule with no registered concept", () => {
    expect(withRuleId("Fix it.", "unregistered_rule")).toBe("Fix it. [unregistered_rule]");
});

test("withRuleId appends the canon references of a registered rule", () => {
    registerCanon({
        meta: { canonical: ["design-tokens"], description: "" },
        ruleId: "tagged_rule",
        ruleName: "govlab/tagged",
    });
    expect(withRuleId("Fix it.", "tagged_rule")).toBe("Fix it. [tagged_rule] [canon: quality:concept:design-tokens]");
});
