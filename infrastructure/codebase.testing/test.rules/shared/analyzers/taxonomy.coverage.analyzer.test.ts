import { describe, expect, it } from "vitest";
import { coverageFindings } from "@ssot/govlab/shared/analyzers/taxonomy.coverage.analyzer.ts";
import { excludedTrees } from "@ssot/govlab/shared/manifests/taxonomy.manifest.ts";
import { relativePath } from "@ssot/paths";

describe("coverageFindings", () => {
    it("reports only paths that no governed root, exclusion or generation folder covers", () => {
        const findings = coverageFindings();
        const excluded = excludedTrees();
        expect(findings.every((finding) => !excluded.some((tree) => finding.path.startsWith(tree)))).toBe(true);
        expect(findings.some((finding) => finding.path.startsWith(relativePath("govlab.quality")))).toBe(false);
    });
});
