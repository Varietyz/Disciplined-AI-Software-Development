import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { offVocabularyFinding } from "coordination-surface/tools/core/factories/vocabulary.factory.ts";

describe("offVocabularyFinding", () => {
    it("files an undeclared value at its line and names the closed set it should come from", () => {
        const finding = offVocabularyFinding({
            closed: ["open", "frozen"],
            declared: { axis: "mutability", line: 6, value: "sealed" },
            target: "taxonomy/lifetime.md",
        });
        assert.equal(finding.rule, "vocabulary/undeclaredValue");
        assert.deepEqual([finding.line, finding.locus, finding.expected], [6, "mutability", "open frozen"]);
        assert.equal(finding.remediation.from, "sealed");
    });
});
