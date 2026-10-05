import { defectLines, worklistLines } from "@govlab/context/core/formatters/validation.formatter.ts";
import { SAMPLE } from "@govlab/context/configuration/constants/invocation.constants.ts";
import assert from "node:assert/strict";
import { createGovlabContext } from "@govlab/context";
import { test } from "vitest";

const issues = createGovlabContext().validateResolution();

test("the bundled resolution has no defect lines and an empty worklist", () => {
    assert.deepEqual(defectLines(issues), []);
    assert.deepEqual(worklistLines(issues, true), []);
});

test("a worklist block samples its items unless the full list is asked for", () => {
    const many = Array.from({ length: SAMPLE + 2 }, (_, index) => `planted-${String(index)}`);
    const planted = { ...issues, unreachableAntiPatterns: many };
    assert.equal(worklistLines(planted, true).length, many.length + 1);
    assert.equal(worklistLines(planted, false).length, SAMPLE + 2);
});

test("a lexicon defect writes one failed line", () => {
    const planted = { ...issues, lexDefects: [{ id: "planted-term", reason: "a planted reason" }] };
    assert.equal(defectLines(planted).length, 1);
});
