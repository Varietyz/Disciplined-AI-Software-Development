import { CODEMOD_TSCONFIGS } from "../selectors/program.selector.ts";
import type { Edit } from "../../types/codemod.types.ts";
import type { SpecifierFinding } from "../../types/analyzer.types.ts";
import { applyCodemod } from "../selectors/codemod.selector.ts";
import { collectTargetFindings } from "../analyzers/specifier.target.analyzer.ts";
import { defineCheck } from "@govlab/context/check";

const RULE_ID = "relative-specifier-resolves";

const buildEdits = function buildEdits(findings: readonly SpecifierFinding[]): Map<string, Edit[]> {
    const byFile = new Map<string, Edit[]>();
    for (const finding of findings) {
        byFile.set(finding.file, [
            ...(byFile.get(finding.file) ?? []),
            { end: finding.end, replacement: finding.to, start: finding.start },
        ]);
    }
    return byFile;
};

applyCodemod({
    appliedNoun: "relative import(s) repointed to the one file in their member that carries the moved name",
    blockedMessage: (finding) => finding.reason ?? "",
    checks: defineCheck({ detects: [], enforces: ["architecture:traceability"] }),
    editsByFile: buildEdits,
    findings: collectTargetFindings(),
    gateOnBlocked: true,
    label: (finding) => `${finding.from} → ${finding.to}`,
    programCount: CODEMOD_TSCONFIGS.length,
    ruleId: RULE_ID,
});
