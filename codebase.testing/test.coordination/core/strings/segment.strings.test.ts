import { describe, it } from "vitest";
import {
    rehearsalLine,
    segmentCounts,
    segmentSummary,
} from "coordination-surface/tools/core/strings/segment.strings.ts";
import assert from "node:assert/strict";

describe("the segment messages", () => {
    it("count the run, name the report and say when it only rehearsed", () => {
        const counts = segmentCounts(4, 3, 2, 1);
        assert.equal(counts, "scanned=4 hits=3 edits=2 rejected=1");
        assert.ok(rehearsalLine("--no-fix").includes("rerun without --no-fix"));
        assert.equal(segmentSummary("PASS", counts, "r.json", ""), `PASS  ${counts}\nreport: r.json\n`);
    });
});
