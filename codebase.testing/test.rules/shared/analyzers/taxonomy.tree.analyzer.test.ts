import { ROOT, relativePath } from "@ssot/paths";
import { basename, join } from "node:path";
import { describe, expect, it } from "vitest";
import { generatedFolderFindings, taxonomyReport } from "@ssot/govlab/shared/analyzers/taxonomy.tree.analyzer.ts";
import { mkdtempSync, rmSync } from "node:fs";
import { writeVerbatim } from "@govlab/canonical-write";

const BINARY_BYTES = Uint8Array.from([0, 1, 2, 0]);

describe("generatedFolderFindings", () => {
    it("finds no intruder in a generation folder whose files all carry the marker", () => {
        const folder = `${relativePath("govlabHost")}/${relativePath("moduleInfo")}`;
        expect(generatedFolderFindings(folder)).toStrictEqual([]);
    });

    it("reports a binary file without the marker, because binaries are governed like text", () => {
        const folder = mkdtempSync(join(ROOT, "_tmp-binary-"));
        try {
            writeVerbatim(join(folder, "subset.woff2"), BINARY_BYTES);
            const findings = generatedFolderFindings(basename(folder));
            expect(findings.map((finding) => finding.messageId)).toStrictEqual(["generatedFolderIntruder"]);
        } finally {
            rmSync(folder, { force: true, recursive: true });
        }
    });
});

describe("taxonomyReport", () => {
    it("assesses every file under the governed roots and pins each finding to a workspace path", () => {
        const report = taxonomyReport();
        expect(report.assessed).toBeGreaterThan(0);
        expect(report.findings.every((finding) => finding.path.length > 0 && finding.messageId.length > 0)).toBe(true);
    });
});
