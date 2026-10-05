import { concernControls, knobLookup } from "@govlab/quality/core/aggregators/concern.aggregator.ts";
import { describe, expect, it } from "vitest";

const CONCEPT = "file-length";

const RULES = [
    { canonical: [CONCEPT], concern: CONCEPT, ruleId: "max-lines", tool: "eslint" },
    { canonical: [CONCEPT], concern: CONCEPT, ruleId: "C0302", tool: "pylint" },
];

const KNOB_CONCEPTS = {
    [CONCEPT]: {
        tools: { pylint: { default: "1000 lines", fidelity: null, knob: "max-module-lines" } },
        valueType: "number",
    },
};

const RULE_KNOBS = { "eslint:max-lines": [{ default: 300, knob: "max", threshold: true }] };

describe("knobLookup", () => {
    it("answers a rule's own knobs and bridges a concept knob the rule does not declare itself", () => {
        const knobsFor = knobLookup(RULES, RULE_KNOBS, KNOB_CONCEPTS);
        expect(knobsFor("eslint", "max-lines").map((knob) => knob.knob)).toStrictEqual(["max"]);
        expect(knobsFor("pylint", "C0302")).toStrictEqual([
            { default: 1000, knob: "max-module-lines", threshold: true },
        ]);
    });
});

describe("concernControls", () => {
    it("derives one control per concern, with the strictest threshold default as its value", () => {
        const [entry] = concernControls(RULES, knobLookup(RULES, RULE_KNOBS, KNOB_CONCEPTS));
        expect(entry?.[0]).toBe(CONCEPT);
        expect(entry?.[1].tools).toBe(2);
        expect(entry?.[1].value).toBe(300);
    });
});
