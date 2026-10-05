import { plantedFaces, plantedPrinciple } from "./ontology.fixture.ts";
import assert from "node:assert/strict";
import { createGovlabContext } from "@govlab/context";
import { crossValidateFaces } from "@govlab/context/core/validators/vocabulary.validator.ts";
import { test } from "vitest";

test("a principle scope spelled apart from its canonical force is misspelled", () => {
    const issues = crossValidateFaces(
        plantedFaces([plantedPrinciple("planted-rule", { scope: ["object creation"] })], []),
    );
    assert.deepEqual(
        issues.misspelledForces.filter((entry) => entry.record === "planted-rule"),
        [{ canonical: "object_creation", record: "planted-rule", token: "object creation" }],
    );
});

test("the bundled faces cross-validate with no dangling principle ref and no unknown force", () => {
    const issues = createGovlabContext().validateResolution();
    assert.deepEqual(issues.danglingPrincipleRefs, []);
    assert.deepEqual(issues.unknownForces, []);
});
