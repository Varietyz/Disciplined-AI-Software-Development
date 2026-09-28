import { CODEMOD_TSCONFIGS } from "../selectors/program.selector.ts";
import type { Edit } from "../../types/codemod.types.ts";
import type { SpecifierFinding } from "../../types/analyzer.types.ts";
import { applyCodemod } from "../selectors/codemod.selector.ts";
import { collectSpecifierFindings } from "../analyzers/specifier.analyzer.ts";
import { defineCheck } from "@govlab/context/check";

const RULE_ID = "closure-no-cross-member-relative";

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
    appliedNoun: "cross-member relative import(s) rewritten to their published package specifier",
    blockedMessage: (finding) => `'${finding.from}' cannot be rewritten: ${finding.reason ?? ""}`,
    checks: defineCheck({ detects: ["architecture:boundary-leakage"], enforces: ["architecture:explicit-boundaries"] }),
    editsByFile: buildEdits,
    findings: collectSpecifierFindings(),
    gateOnBlocked: true,
    label: (finding) => `${finding.from} → ${finding.to}`,
    programCount: CODEMOD_TSCONFIGS.length,
    ruleId: RULE_ID,
});
