import { expect, test } from "vitest";
import { tallyBy } from "@govlab/quality/core/aggregators/catalog.aggregator.ts";

test("tallyBy counts rules per value of a field and buckets a missing value as none", () => {
    const rules = [
        { category: "style", ruleId: "a" },
        { category: "style", ruleId: "b" },
        { category: "bugs", ruleId: "c" },
        { ruleId: "d" },
    ];
    expect(tallyBy(rules, "category")).toStrictEqual({ bugs: 1, none: 1, style: 2 });
});
