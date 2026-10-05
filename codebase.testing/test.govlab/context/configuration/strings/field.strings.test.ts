import {
    misshapenField,
    missingField,
    nonKebabId,
    outsideVocabulary,
    refusedRecord,
} from "@govlab/context/configuration/strings/field.strings.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("every field defect names the field, the shape or the id it reports", () => {
    assert.equal(missingField("text"), "has no text, which its kind requires");
    assert.equal(misshapenField("size", "true or false"), "has size set to something other than true or false");
    assert.equal(nonKebabId("A_Id"), 'has the id "A_Id", which is not kebab-case');
});

test("a refused record joins its defects, and an outside value names the vocabulary", () => {
    assert.equal(refusedRecord("probe", "sample", "a", ["one", "two"]), 'probe: the sample "a" one; two');
    assert.ok(outsideVocabulary("a level", "medium", ["low", "high"]).endsWith("low, high"));
});
