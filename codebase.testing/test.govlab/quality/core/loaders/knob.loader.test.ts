import { expect, test } from "vitest";
import { loadKnobConcepts } from "@govlab/quality/core/loaders/knob.loader.ts";

test("loadKnobConcepts reads each concept with a value type and a knob per tool", () => {
    const concepts = Object.values(loadKnobConcepts());
    expect(concepts.length).toBeGreaterThan(0);
    expect(concepts.every((concept) => concept.valueType !== "" && typeof concept.tools === "object")).toBe(true);
});
