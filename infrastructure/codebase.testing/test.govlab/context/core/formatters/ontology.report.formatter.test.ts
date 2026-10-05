import { listDetailLines, targetLines, targetsOf } from "@govlab/context/core/formatters/ontology.report.formatter.ts";
import assert from "node:assert/strict";
import { createGovlabContext } from "@govlab/context";
import { test } from "vitest";

const issues = createGovlabContext().validateResolution();

test("the bundled resolution has no detail lines and no targets", () => {
    assert.deepEqual(listDetailLines(issues), []);
    assert.deepEqual(targetsOf(issues), []);
    assert.deepEqual(targetLines(issues, true), []);
});

test("targets are ranked by how many edges name them", () => {
    const planted = {
        ...issues,
        unresolvedArchEdges: [
            { from: "a", relation: "requires", target: "lone" },
            { from: "b", relation: "requires", target: "shared" },
            { from: "c", relation: "enables", target: "shared" },
        ],
    };
    assert.deepEqual(targetsOf(planted), [
        ["shared", ["b.requires", "c.enables"]],
        ["lone", ["a.requires"]],
    ]);
    assert.ok(targetLines(planted, false).length > 1);
});

test("an untyped record lands in the backlog block of the detail lines", () => {
    const planted = { ...issues, reasonNative: { ...issues.reasonNative, untypedRecords: ["planted-record"] } };
    const lines = listDetailLines(planted);
    assert.equal(lines.length, 2);
    assert.ok(lines[1]?.includes("planted-record") === true);
});
