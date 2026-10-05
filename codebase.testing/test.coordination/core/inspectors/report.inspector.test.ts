import { describe, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { GENERATED_DIR } from "coordination-surface/tools/core/constants/path.constants.ts";
import { REPORT_SUFFIX } from "coordination-surface/tools/core/constants/report.constants.ts";
import assert from "node:assert/strict";
import { checkGateState } from "coordination-surface/tools/core/inspectors/report.inspector.ts";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const REPORTS = [
    ["lint", { authoritative: true, tool: "lint", verdict: "pass" }],
    ["tests", { authoritative: true, tool: "tests", verdict: "fail" }],
    ["bypassed", { authoritative: true, bypassed: true, tool: "docs", verdict: "fail" }],
    ["partial", { authoritative: false, tool: "types", verdict: "fail" }],
] as const;

const BOARD = [
    "Gate — lint",
    "  State: RED",
    "Gate — tests",
    "  State: RED",
    "Gate — docs",
    "  State: PASS",
    "Gate — types",
    "  State: PASS",
    "  State: RED",
].join("\n");

const seeded = function seeded(): string {
    const root = mkdtempSync(resolve(tmpdir(), "report-inspector-"));
    const folder = resolve(root, GENERATED_DIR);
    mkdirSync(folder, { recursive: true });
    for (const [name, report] of REPORTS) {
        writeVerbatim(resolve(folder, `${name}${REPORT_SUFFIX}`), JSON.stringify(report));
    }
    writeVerbatim(resolve(folder, `broken${REPORT_SUFFIX}`), "{ not json");
    return root;
};

describe("checkGateState", () => {
    it("reports a stated gate that disagrees with its authoritative, unbypassed report", () => {
        const root = seeded();
        try {
            const findings = checkGateState(BOARD, root);
            assert.deepEqual(
                findings.map((finding) => [finding.line, finding.locus]),
                [[2, "RED"]],
            );
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });

    it("reports nothing when no report folder exists", () => {
        const absent = resolve(tmpdir(), "report-inspector-absent");
        assert.deepEqual(checkGateState(BOARD, absent), []);
    });
});
