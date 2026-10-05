import {
    PREVIEW_ONLY,
    appliedOutcome,
    corpusHead,
    corpusSummary,
    noMovesList,
    rewroteLine,
} from "coordination-surface/tools/core/strings/corpus.strings.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

describe("the corpus messages", () => {
    it("report the moves, the outcome and the report location", () => {
        assert.equal(rewroteLine(3, 2), "rewrote 3 references from 2 recorded moves\n");
        assert.ok(noMovesList("corpus.json").includes("corpus.json carries no readable moves list"));
        assert.equal(appliedOutcome(4), "applied, references rewritten=4");
        const head = corpusHead("PASS", 2, 0, PREVIEW_ONLY);
        assert.equal(head, "PASS  resolved=2 findings=0 preview only");
        assert.ok(corpusSummary(head, "{}", "{}", "r.json", "").includes("report: r.json"));
    });
});
