import { PLANTED_GATE, PLANTED_ID, plantedFaces, plantedPrinciple } from "../validators/ontology.fixture.ts";
import type { TermCategory } from "@govlab/context/types/lexicon.types.ts";
import assert from "node:assert/strict";
import { checkedRecordsOf } from "@govlab/context/core/selectors/check.selector.ts";
import { test } from "vitest";

test("a term named only by a tension edge takes the tension resolution as its check", () => {
    const terms: TermCategory[] = [
        {
            category: "planted",
            records: [{ definition: "The degree to which work is fast.", kind: "quality-attribute", name: "Speed" }],
        },
    ];
    const faces = plantedFaces(
        [plantedPrinciple(PLANTED_ID, { enforced_by: PLANTED_GATE, tensions_with: ["Speed"] })],
        terms,
    );
    const term = checkedRecordsOf(faces).find((record) => record.id === "speed");
    assert.deepEqual(term?.by, [`the tension resolution with ${PLANTED_ID}`]);
});

test("a term named only by a repair field takes the principle that names it as its check", () => {
    const terms: TermCategory[] = [
        {
            category: "planted",
            records: [
                { definition: "A technique that splits one module in two.", kind: "technique", name: "Split Module" },
            ],
        },
    ];
    const faces = plantedFaces(
        [plantedPrinciple(PLANTED_ID, { enforced_by: PLANTED_GATE, refactored_by: ["lexicon:split-module"] })],
        terms,
    );
    const term = checkedRecordsOf(faces).find((record) => record.id === "split-module");
    assert.deepEqual(term?.by, [`architecture:${PLANTED_ID}`]);
});
