import { describe, expect, it } from "vitest";
import { collectReferenceFindings } from "@ssot/govlab/codemods/analyzers/reference.analyzer.ts";

const CONSTRUCTS = ["html src/href", "css url()"];

describe("collectReferenceFindings", () => {
    const findings = collectReferenceFindings();

    it("names every finding by the construct that carries it", () => {
        for (const finding of findings) {
            expect(CONSTRUCTS).toContain(finding.construct);
            expect(finding.file.length).toBeGreaterThan(0);
            expect(finding.token.length).toBeGreaterThan(0);
            expect(finding.value.length).toBeGreaterThan(0);
        }
    });

    it("scans no package.json or tsconfig — npm and tsc read those before our code runs", () => {
        expect(findings.filter((finding) => finding.file.endsWith("package.json"))).toEqual([]);
        expect(findings.filter((finding) => finding.file.startsWith("tsconfig."))).toEqual([]);
    });

    it("finds no markup naming a workspace location by literal", () => {
        const offenders = findings.map((finding) => `${finding.file}: "${finding.value}" names '${finding.token}'`);
        expect(offenders).toEqual([]);
    });
});
