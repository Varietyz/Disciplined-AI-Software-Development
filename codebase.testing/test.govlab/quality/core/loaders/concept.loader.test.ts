import { expect, test } from "vitest";
import { loadConceptDefinitions, loadExemplars } from "@govlab/quality/core/loaders/concept.loader.ts";

test("loadConceptDefinitions reads every concept with its id and matching vocabulary", () => {
    const definitions = loadConceptDefinitions();
    expect(definitions.length).toBeGreaterThan(0);
    expect(definitions.every((definition) => definition.id !== "" && Array.isArray(definition.words))).toBe(true);
});

test("loadExemplars reads the exemplar table as a record", () => {
    expect(typeof loadExemplars()).toBe("object");
});
