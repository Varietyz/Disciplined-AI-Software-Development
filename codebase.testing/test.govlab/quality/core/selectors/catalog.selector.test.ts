import { expect, test } from "vitest";
import { distinctRules } from "@govlab/quality/core/selectors/catalog.selector.ts";

test("distinctRules keeps the first rule of each id, in order", () => {
    const rules = [
        { ruleId: "a", tool: "one" },
        { ruleId: "b", tool: "one" },
        { ruleId: "a", tool: "two" },
    ];
    expect(distinctRules(rules)).toStrictEqual([
        { ruleId: "a", tool: "one" },
        { ruleId: "b", tool: "one" },
    ]);
});
