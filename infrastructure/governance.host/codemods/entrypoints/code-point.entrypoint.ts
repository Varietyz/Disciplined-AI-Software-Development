import { CODEMOD_TSCONFIGS, programFor, repoSourceFiles } from "../selectors/program.selector.ts";
import { replacementText, scanSourceFile } from "../analyzers/code-point.analyzer.ts";
import type { CodePointFinding } from "../../types/analyzer.types.ts";
import type { Edit } from "../../types/codemod.types.ts";
import { applyCodemod } from "../selectors/codemod.selector.ts";
import { defineCheck } from "@govlab/context/check";

const RULE_ID = "prefer-code-point";

const scanProgram = function scanProgram(tsconfigPath: string): CodePointFinding[] {
    const program = programFor(tsconfigPath);
    const checker = program.getTypeChecker();
    return repoSourceFiles(program).flatMap((sourceFile) => scanSourceFile(checker, sourceFile));
};

const buildEdits = function buildEdits(findings: readonly CodePointFinding[]): Map<string, Edit[]> {
    const byFile = new Map<string, Edit[]>();
    for (const finding of findings) {
        const edit: Edit = { end: finding.end, replacement: replacementText(finding), start: finding.start };
        byFile.set(finding.fileName, [...(byFile.get(finding.fileName) ?? []), edit]);
    }
    return byFile;
};

const collect = function collect(): CodePointFinding[] {
    const seen = new Set<string>();
    const findings: CodePointFinding[] = [];
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
    appliedNoun: "charCodeAt call(s) rewritten to a null-coalesced codePointAt",
    blockedMessage: (finding) =>
        `'charCodeAt' returns a UTF-16 code unit, so it splits an astral character into surrogate halves; 'codePointAt' returns the whole code point but widens the result to 'number | undefined'. This call cannot be rewritten automatically (${finding.reason}).`,
    checks: defineCheck({ detects: [], enforces: ["architecture:correctness"] }),
    editsByFile: buildEdits,
    findings: collect(),
    gateOnBlocked: false,
    label: (finding) => finding.receiver,
    programCount: CODEMOD_TSCONFIGS.length,
    ruleId: RULE_ID,
});
