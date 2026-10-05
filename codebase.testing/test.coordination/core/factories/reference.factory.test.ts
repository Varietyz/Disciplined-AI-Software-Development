import { cycleFinding, unresolvedFinding } from "coordination-surface/tools/core/factories/reference.factory.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const REFERENCE = { line: 5, locus: "see", raw: "see: gone.md", target: "gone.md" };

describe("unresolvedFinding", () => {
    it("renames the reference to the one file carrying its basename, and leaves several candidates to judgment", () => {
        const one = unresolvedFinding("rules/a.md", REFERENCE, ["docs/gone.md"]);
        assert.equal(one.rule, "reference/unresolved");
        assert.deepEqual(
            [one.expected, one.remediation.to, one.remediation.deterministic],
            ["docs/gone.md", "docs/gone.md", true],
        );
        const many = unresolvedFinding("rules/a.md", REFERENCE, ["a/gone.md", "b/gone.md"]);
        assert.deepEqual([many.expected, many.remediation.to, many.remediation.deterministic], [null, null, false]);
    });
});

describe("cycleFinding", () => {
    it("names the closed loop starting and ending at its first document", () => {
        const finding = cycleFinding(["a.md", "b.md"], 12);
        assert.equal(finding.rule, "reference/citationCycle");
        assert.equal(finding.actual, "a.md > b.md > a.md");
        assert.equal(finding.path, "a.md");
    });
});
