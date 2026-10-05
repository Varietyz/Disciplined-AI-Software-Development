import { asCheck, evidenceSignOf, mergeCheck } from "@govlab/context/core/converters/check.converter.ts";
import { EVIDENCE_SIGNS } from "@govlab/context/configuration/constants/check.constants.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const WATCHED = "a planted violation";

test("an evidence sign is read before its separator, and a sign with nothing after it is no sign", () => {
    for (const sign of EVIDENCE_SIGNS) {
        assert.equal(evidenceSignOf(`${sign}: ${WATCHED}`), sign);
    }
    assert.equal(evidenceSignOf("probably: it looked fine"), null);
    assert.equal(evidenceSignOf("fires:"), null);
    assert.equal(evidenceSignOf("fires"), null);
});

test("a check facet keeps only the answers it carries, and a value that is not a record is no facet", () => {
    assert.deepEqual(asCheck({ by: ["a gate"], evidence: `fires: ${WATCHED}`, population: "", refusal: 4 }), {
        by: ["a gate"],
        evidence: `fires: ${WATCHED}`,
    });
    assert.equal(asCheck("not a record"), null);
});

test("a record's own answers win over its category's, and either side alone stands", () => {
    const declared = { authority: "the category rule", population: "every record" };
    const own = { population: "the one record" };
    assert.deepEqual(mergeCheck(declared, own), { authority: "the category rule", population: "the one record" });
    assert.deepEqual(mergeCheck(null, own), own);
    assert.deepEqual(mergeCheck(declared, null), declared);
});
