import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { sourceSummary } from "coordination-surface/tools/core/strings/source.strings.ts";

describe("sourceSummary", () => {
    it("says whether the sweep cleaned or previewed, with its counts and report", () => {
        const counts = { files: 2, kept: 1, removed: 3, scanned: 9 };
        assert.ok(sourceSummary(true, counts, "r.json").startsWith("CLEANED  scanned=9 files=2 removed=3"));
        assert.ok(sourceSummary(false, counts, "r.json").includes("report: r.json"));
    });
});
