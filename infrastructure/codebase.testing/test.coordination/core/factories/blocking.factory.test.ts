import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { blockingFinding } from "coordination-surface/tools/core/factories/blocking.factory.ts";

describe("blockingFinding", () => {
    it("names its kind in the rule and anchors at the venue, or at the anchor it is given", () => {
        const plain = blockingFinding("unreadHold", "venue.md", "held", "released", "decide");
        assert.equal(plain.rule, "blocking/unreadHold");
        assert.equal(plain.locus, "venue.md");
        assert.deepEqual([plain.actual, plain.expected, plain.remediation.decide], ["held", "released", "decide"]);
        assert.equal(blockingFinding("x", "venue.md", "a", "b", "c", "## DEFERRED").locus, "## DEFERRED");
    });
});
