import { PLANTED_ID, plantedFaces, plantedPrinciple } from "../validators/ontology.fixture.ts";
import { checkGapsOf, uncoveredCollectionsOf } from "@govlab/context/core/analyzers/check.analyzer.ts";
import { ARCH_FACE } from "@govlab/constants";
import assert from "node:assert/strict";
import { test } from "vitest";

test("the check gaps take their resolution from the resolver they are handed", () => {
    const faces = plantedFaces([plantedPrinciple(PLANTED_ID, { enforced_by: ["architecture:any-rule"] })], []);
    const plantedRefs = (resolve: () => boolean): { collection: string; field: string; id: string; ref: string }[] =>
        checkGapsOf(faces, { collections: new Set([ARCH_FACE]), resolve }, [ARCH_FACE], []).unresolvedCheckRefs.filter(
            (entry) => entry.id === PLANTED_ID,
        );
    assert.deepEqual(
        plantedRefs(() => false),
        [{ collection: ARCH_FACE, field: "by", id: PLANTED_ID, ref: "architecture:any-rule" }],
    );
    assert.deepEqual(
        plantedRefs(() => true),
        [],
    );
});

test("a registered collection with no record in the measurement is reported", () => {
    assert.deepEqual(uncoveredCollectionsOf([ARCH_FACE, "future"], []), [ARCH_FACE, "future"]);
});
