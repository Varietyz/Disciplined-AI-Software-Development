import assert from "node:assert/strict";
import { normalizePrinciple } from "@govlab/context/core/normalizers/architecture.normalizer.ts";
import { plantedPrinciple } from "../validators/ontology.fixture.ts";
import { test } from "vitest";

const [record] = plantedPrinciple("", { name: "Planted Rule" }).records;
const raw = Object.fromEntries(Object.entries(record ?? {}).filter(([key]) => key !== "id"));

test("normalizePrinciple derives the id from the name, keeps the category and drops the empty optional fields", () => {
    const principle = normalizePrinciple(raw, "planted", null);
    assert.equal(principle.id, "planted-rule");
    assert.equal(principle.category, "planted");
    assert.equal("mandatoryFor" in principle, false);
    assert.equal("canon" in principle, false);
});

test("normalizePrinciple refuses a severity outside the closed levels", () => {
    assert.throws(() => normalizePrinciple({ ...raw, severity: "high" }, "planted", null));
});
