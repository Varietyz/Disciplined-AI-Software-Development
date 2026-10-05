import { expect, test } from "vitest";
import type { QualityRuleRecord } from "@govlab/quality/types/catalog.types.ts";
import { emitStylelintConfig } from "@govlab/quality/core/emitters/stylelint.emitter.ts";

const NESTING = 3;

const rule = function rule(tool: string, ruleId: string, canonical: string[]): QualityRuleRecord {
    return {
        canonical,
        category: "style",
        concern: "",
        ecosystem: "css",
        name: ruleId,
        ruleId,
        ruleName: ruleId,
        tool,
        url: "",
    };
};

test("emitStylelintConfig turns on every govlab rule and emits a concern value in its primary form", () => {
    const data = {
        concepts: [],
        concerns: [],
        rules: [
            rule("govlab-stylelint", "govlab/consistent-naming", ["naming-convention"]),
            {
                ...rule("stylelint", "max-nesting-depth", ["deep-nesting"]),
                knobs: [{ default: 2, knob: "max", threshold: true, type: "integer" }],
            },
        ],
        tools: [],
    };
    const config = emitStylelintConfig({ concerns: { "deep-nesting": NESTING } }, data);
    expect(config["govlab/consistent-naming"]).toBe(true);
    expect(config["max-nesting-depth"]).toStrictEqual([NESTING]);
});
