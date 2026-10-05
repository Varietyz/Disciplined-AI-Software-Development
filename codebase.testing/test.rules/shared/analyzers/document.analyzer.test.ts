import { describe, expect, it } from "vitest";
import { documentFindingsOf } from "@ssot/govlab/shared/analyzers/document.analyzer.ts";

describe("documentFindingsOf", () => {
    it("finds nothing in a plain sentence and names the check a semicolon breaks", () => {
        expect(documentFindingsOf("The gate runs once per state.")).toStrictEqual([]);
        const findings = documentFindingsOf("The gate runs once; the report follows.");
        expect(findings.map((finding) => finding.check)).toContain("no-semicolon");
    });
});
