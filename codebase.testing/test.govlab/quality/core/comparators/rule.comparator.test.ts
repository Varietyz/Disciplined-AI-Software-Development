import { expect, test } from "vitest";
import { byRuleId } from "@govlab/quality/core/comparators/rule.comparator.ts";

test("byRuleId orders rules by id and holds equal ids level", () => {
    const rules = [{ ruleId: "no-var" }, { ruleId: "eqeqeq" }, { ruleId: "max-lines" }];
    expect(rules.toSorted(byRuleId).map((rule) => rule.ruleId)).toStrictEqual(["eqeqeq", "max-lines", "no-var"]);
    expect(byRuleId({ ruleId: "a" }, { ruleId: "a" })).toBe(0);
});
