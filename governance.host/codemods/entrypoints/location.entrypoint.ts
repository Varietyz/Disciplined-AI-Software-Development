import { CODEMOD_TSCONFIGS } from "../selectors/program.selector.ts";
import type { Edit } from "../../types/codemod.types.ts";
import type { LocationFinding } from "../../types/analyzer.types.ts";
import { applyCodemod } from "../selectors/codemod.selector.ts";
import { collectLocationFindings } from "../analyzers/location.analyzer.ts";
import { defineCheck } from "@govlab/context/check";

const RULE_ID = "closure-paths-via-ssot";
const SSOT_IMPORT = 'import { relativePath } from "@ssot/paths";\n';

const buildEdits = function buildEdits(findings: readonly LocationFinding[]): Map<string, Edit[]> {
    const byFile = new Map<string, Edit[]>();
    for (const finding of findings) {
        byFile.set(finding.file, [
            ...(byFile.get(finding.file) ?? []),
            { end: finding.end, replacement: finding.to, start: finding.start },
        ]);
    }
    for (const [file, edits] of byFile) {
        if (findings.some((finding) => finding.file === file && finding.needsImport)) {
            byFile.set(file, [{ end: 0, replacement: SSOT_IMPORT, start: 0 }, ...edits]);
        }
    }
    return byFile;
};

applyCodemod({
    appliedNoun: "hardcoded workspace location(s) resolved through the paths SSOT",
    blockedMessage: (finding) => finding.reason ?? "",
    checks: defineCheck({
        detects: ["architecture:hardcoded-configuration"],
        enforces: ["architecture:single-source-of-truth"],
    }),
    editsByFile: buildEdits,
    findings: collectLocationFindings(),
    gateOnBlocked: false,
    label: (finding) => `"${finding.from}" → ${finding.to}`,
    programCount: CODEMOD_TSCONFIGS.length,
    ruleId: RULE_ID,
});
