import { coverageLines, nativeLines, summaryLines } from "@govlab/context/core/formatters/ontology.formatter.ts";
import assert from "node:assert/strict";
import { createGovlabContext } from "@govlab/context";
import { test } from "vitest";

const context = createGovlabContext();
const issues = context.validateResolution();

test("the summary opens with the report heading and carries one row per measured issue", () => {
    const lines = summaryLines(issues, context.lex.all().length, 0);
    assert.ok(lines.length > 1);
    assert.equal(new Set(lines).size, lines.length);
});

test("the coverage lines carry one row per checked collection", () => {
    const gaps = context.checkGaps();
    assert.equal(coverageLines(gaps).length, gaps.collections.length + 2);
});

test("the native lines close on the total", () => {
    const lines = nativeLines(issues);
    assert.ok(lines.at(-1)?.includes(String(issues.total)) === true);
});
