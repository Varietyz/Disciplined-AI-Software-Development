import { describe, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import {
    toEditRecords,
    toHitRecords,
    verdictOf,
    writeReport,
} from "coordination-surface/tools/core/reporters/segment.reporter.ts";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";

type Hit = Parameters<typeof toHitRecords>[0][number];
type Report = Parameters<typeof writeReport>[2];

type Segment = Hit["segments"][number];

const EDIT = { end: 4, path: "a.md", reason: "rename", replacement: "new", start: 1 };

const segment = function segment(text: string, line: number): Segment {
    return { end: text.length, inlines: [], kind: "text", line, start: 0, text };
};

describe("toHitRecords and toEditRecords", () => {
    it("flatten a hit to its pattern, path, line and joined text, and an edit to its span and replacement", () => {
        const hit: Hit = {
            index: 0,
            path: "a.md",
            patternId: "probe",
            segments: [segment("one", 3), segment("two", 4)],
            span: { end: 7, line: 3, start: 0 },
        };
        assert.deepEqual(toHitRecords([hit]), [{ line: 3, path: "a.md", pattern: "probe", text: "one\ntwo" }]);
        assert.deepEqual(toEditRecords([EDIT]), [EDIT]);
    });
});

describe("verdictOf", () => {
    it("passes only with no finding and no rejected edit", () => {
        assert.equal(verdictOf([], []), "pass");
        assert.equal(verdictOf([], [EDIT]), "fail");
    });
});

describe("writeReport", () => {
    it("writes the report as indented JSON under the generated folder and returns its path", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-segment-"));
        try {
            const report: Report = {
                coverage: { filesByExtension: {}, roots: [] },
                edits: [],
                findings: [],
                hits: [],
                rejected: [],
                scanned: 0,
                tool: "segment",
                verdict: "pass",
            };
            const target = writeReport(root, "segment", report);
            assert.ok(target.endsWith("segment.generated.json"));
            assert.deepEqual(JSON.parse(readFileSync(target, "utf8")), report);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
