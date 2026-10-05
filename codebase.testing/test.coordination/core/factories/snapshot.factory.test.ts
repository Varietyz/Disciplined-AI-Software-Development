import { describe, it } from "vitest";
import { frozenFinding, shortenedFinding } from "coordination-surface/tools/core/factories/snapshot.factory.ts";
import { SNAPSHOT_STEP } from "coordination-surface/tools/core/readers/snapshot.reader.ts";
import assert from "node:assert/strict";

describe("snapshot findings", () => {
    it("anchor a shortened surface at its first missing member and a frozen one at its first difference", () => {
        const shortened = shortenedFinding("history.md", ["record:A", "record:B"], "kept · open · none");
        assert.equal(shortened.rule, `${SNAPSHOT_STEP}/shortenedGovernedSurface`);
        assert.equal(shortened.locus, "record:A");
        assert.ok(shortened.stack.some((entry) => entry.resolved === "record:A · record:B"));
        assert.equal(shortenedFinding("history.md", [], "x").locus, "history.md");

        const frozen = frozenFinding("binding.md", ["record:C"], "kept · frozen · none");
        assert.equal(frozen.rule, `${SNAPSHOT_STEP}/frozenSurfaceWritten`);
        assert.equal(frozen.locus, "record:C");
    });
});
