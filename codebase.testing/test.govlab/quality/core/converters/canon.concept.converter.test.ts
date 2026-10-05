import { expect, test } from "vitest";
import { mappingConcepts } from "@govlab/quality/core/converters/canon.concept.converter.ts";

const CONCEPT = "file-length";

const CONCEPTS = [{ byEcosystem: {}, byTool: {}, dimension: "size", id: CONCEPT, sample: [], tools: 2, total: 3 }];

test("mappingConcepts groups each concept's rules per tool, with the knob a concept declares for that tool", () => {
    const rules = [
        { canonical: [CONCEPT], ecosystem: "typescript", ruleId: "max-lines", tool: "eslint" },
        { canonical: [CONCEPT], ecosystem: "python", ruleId: "C0302", tool: "pylint" },
        { canonical: CONCEPT, ecosystem: "python", ruleId: "C0303", tool: "pylint" },
    ];
    const knobs = {
        [CONCEPT]: { tools: { eslint: { default: 300, fidelity: "exact", knob: "max" } }, valueType: "number" },
    };
    const mapped = mappingConcepts(rules, CONCEPTS, knobs).get(CONCEPT);
    expect(mapped?.dimension).toBe("size");
    expect(mapped?.ruleCount).toBe(3);
    expect(mapped?.entries.map((entry) => [entry.tool, entry.knob])).toStrictEqual([
        ["pylint", null],
        ["eslint", "max"],
    ]);
});
