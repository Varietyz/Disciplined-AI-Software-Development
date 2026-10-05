import { describe, expect, it } from "vitest";
import { collectLocationFindings } from "@ssot/govlab/codemods/analyzers/location.analyzer.ts";

describe("collectLocationFindings", () => {
    const findings = collectLocationFindings();

    it("returns findings whose spans are well formed", () => {
        for (const finding of findings) {
            expect(finding.end).toBeGreaterThanOrEqual(finding.start);
            expect(finding.file.length).toBeGreaterThan(0);
            expect(finding.line).toBeGreaterThan(0);
        }
    });

    it("separates convertible findings from blocked ones by whether a reason is stated", () => {
        const blocked = findings.filter((finding) => finding.reason !== null);
        expect(blocked.every((finding) => (finding.reason ?? "").length > 0)).toBe(true);
    });
});
