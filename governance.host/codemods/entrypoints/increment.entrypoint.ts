import { CODEMOD_TSCONFIGS, programFor, repoSourceFiles } from "../selectors/program.selector.ts";
import { replacementText, scanSourceFile } from "../analyzers/increment.analyzer.ts";
import type { Edit } from "../../types/codemod.types.ts";
import type { IncrementFinding } from "../../types/analyzer.types.ts";
import { applyCodemod } from "../selectors/codemod.selector.ts";
import { defineCheck } from "@govlab/context/check";

const RULE_ID = "no-plusplus";

const scanProgram = function scanProgram(tsconfigPath: string): IncrementFinding[] {
    return repoSourceFiles(programFor(tsconfigPath)).flatMap((sourceFile) => scanSourceFile(sourceFile));
};

const buildEdits = function buildEdits(findings: readonly IncrementFinding[]): Map<string, Edit[]> {
    const byFile = new Map<string, Edit[]>();
    for (const finding of findings) {
        const edit: Edit = { end: finding.end, replacement: replacementText(finding), start: finding.start };
        byFile.set(finding.fileName, [...(byFile.get(finding.fileName) ?? []), edit]);
    }
    return byFile;
};

const collect = function collect(): IncrementFinding[] {
    const seen = new Set<string>();
    const findings: IncrementFinding[] = [];
    for (const tsconfig of CODEMOD_TSCONFIGS) {
        for (const finding of scanProgram(tsconfig)) {
            const key = `${finding.file}:${String(finding.start)}`;
            if (!seen.has(key)) {
                seen.add(key);
                findings.push(finding);
            }
        }
    }
    return findings;
};

applyCodemod({
    appliedNoun: "value-discarding increment(s) rewritten to compound assignment",
    blockedMessage: (finding) =>
        `'${finding.operand}++' is used where its value is read, so '${finding.operand} += 1' would change what the expression evaluates to — a postfix increment yields the value BEFORE the increment. Hoist the increment to its own statement and read the prior value explicitly.`,
    checks: defineCheck({ detects: [], enforces: ["architecture:standardization"] }),
    editsByFile: buildEdits,
    findings: collect(),
    gateOnBlocked: false,
    label: (finding) => finding.operand,
    programCount: CODEMOD_TSCONFIGS.length,
    ruleId: RULE_ID,
});
