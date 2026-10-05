import { canonOf, registerCanon } from "@govlab/quality/core/registries/stylelint.registry.ts";
import { expect, test } from "vitest";

test("canonOf answers the concepts a rule registered, and nothing for an empty or unknown rule", () => {
    registerCanon({
        meta: { canonical: ["magic-number"], description: "" },
        ruleId: "counted_rule",
        ruleName: "govlab/counted",
    });
    registerCanon({ meta: { canonical: [], description: "" }, ruleId: "empty_rule", ruleName: "govlab/empty" });
    expect(canonOf("counted_rule")).toStrictEqual(["magic-number"]);
    expect(canonOf("empty_rule")).toStrictEqual([]);
    expect(canonOf("unknown_rule")).toStrictEqual([]);
});
