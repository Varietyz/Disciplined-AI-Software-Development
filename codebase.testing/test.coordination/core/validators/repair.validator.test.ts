import { describe, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { GENERATED_DIR } from "coordination-surface/tools/core/constants/path.constants.ts";
import { REPORT_SUFFIX } from "coordination-surface/tools/core/constants/report.constants.ts";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { unrepairableLoci } from "coordination-surface/tools/core/validators/repair.validator.ts";
import { writeVerbatim } from "@govlab/canonical-write";

const FROZEN = "frozen.md";

const finding = function finding(target: string, locus: string): object {
    return { locus, path: target, remediation: { target }, rule: "probe/kind" };
};

describe("unrepairableLoci", () => {
    it("names each reported repair aimed at a frozen target or a permanent span, once", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-repair-"));
        try {
            mkdirSync(join(root, GENERATED_DIR), { recursive: true });
            const findings = [
                finding(FROZEN, "a"),
                finding(FROZEN, "a"),
                finding("open.md", "permanent"),
                finding("open.md", "free"),
                { locus: "no remediation" },
            ];
            writeVerbatim(join(root, GENERATED_DIR, `probe${REPORT_SUFFIX}`), JSON.stringify({ findings }));
            writeVerbatim(join(root, GENERATED_DIR, `empty${REPORT_SUFFIX}`), JSON.stringify({ findings: "none" }));
            const report = `probe${REPORT_SUFFIX}`;
            assert.deepEqual(
                unrepairableLoci(
                    root,
                    (target) => target === FROZEN,
                    (_path, locus) => locus === "permanent",
                ),
                [
                    { reason: "frozenTarget", report, rule: "probe/kind", target: FROZEN },
                    { reason: "permanentSpan", report, rule: "probe/kind", target: "open.md" },
                ],
            );
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
