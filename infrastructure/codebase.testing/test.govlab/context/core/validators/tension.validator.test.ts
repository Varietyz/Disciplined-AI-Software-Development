import { PLANTED_GATE, plantedFaces, plantedPrinciple } from "./ontology.fixture.ts";
import { deadSeedsOf, tensionIssuesOf } from "@govlab/context/core/validators/tension.validator.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("a tension edge no layer places is a gap, and the bundled join seeds no dead resolution", () => {
    const faces = plantedFaces(
        [
            plantedPrinciple("speed-rule", { enforced_by: PLANTED_GATE, tensions_with: ["care-rule"] }),
            plantedPrinciple("care-rule", { enforced_by: PLANTED_GATE }),
        ],
        [],
    );
    const gaps = tensionIssuesOf(faces).filter((gap) => gap.from === "speed-rule");
    assert.deepEqual(
        gaps.map((gap) => gap.target),
        ["care-rule"],
    );
    assert.equal(deadSeedsOf({ ...faces.layerJoin, deadSeeds: () => [] }).length, 0);
});

test("a dead seed is reported with both of its ends", () => {
    const seed = { a: "x", b: "y", mechanism: "mitigation" as const, rule: "r", scopeA: "s", scopeB: "t" };
    const faces = plantedFaces([], []);
    const dead = deadSeedsOf({ ...faces.layerJoin, deadSeeds: () => [seed] });
    assert.deepEqual(
        dead.map((gap) => [gap.from, gap.target]),
        [["x", "y"]],
    );
});
