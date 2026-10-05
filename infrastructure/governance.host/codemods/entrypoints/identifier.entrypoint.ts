import { CODEMOD_TSCONFIGS, programFor, repoSourceFiles } from "../selectors/program.selector.ts";
import type { Edit } from "../../types/codemod.types.ts";
import type { IdentifierFinding } from "../../types/analyzer.types.ts";
import { applyCodemod } from "../selectors/codemod.selector.ts";
import { defineCheck } from "@govlab/context/check";
import { scanProgram } from "../analyzers/identifier.analyzer.ts";

const RULE_ID = "naming-convention";

const buildEdits = function buildEdits(findings: readonly IdentifierFinding[]): Map<string, Edit[]> {
    const byFile = new Map<string, Edit[]>();
    for (const finding of findings) {
        for (const location of finding.locations) {
            const edit: Edit = { end: location.end, replacement: finding.to, start: location.start };
            byFile.set(location.fileName, [...(byFile.get(location.fileName) ?? []), edit]);
        }
    }
    return byFile;
};

const locationKey = function locationKey(location: { fileName: string; start: number }): string {
    return `${location.fileName}:${String(location.start)}`;
};

const merged = function merged(
    existing: Readonly<IdentifierFinding>,
    addition: Readonly<IdentifierFinding>,
): IdentifierFinding {
    const seen = new Set(existing.locations.map(locationKey));
    const extra = addition.locations.filter((location) => !seen.has(locationKey(location)));
    return { ...existing, locations: [...existing.locations, ...extra], reason: addition.reason ?? existing.reason };
};

const collect = function collect(): IdentifierFinding[] {
    const byDeclaration = new Map<string, IdentifierFinding>();
    for (const tsconfig of CODEMOD_TSCONFIGS) {
        const program = programFor(tsconfig);
        for (const finding of scanProgram(program, repoSourceFiles(program))) {
            const key = `${finding.file}:${String(finding.line)}:${finding.from}`;
            const existing = byDeclaration.get(key);
            byDeclaration.set(key, existing === undefined ? finding : merged(existing, finding));
        }
    }
    return [...byDeclaration.values()];
};

applyCodemod({
    appliedNoun: "PascalCase const reference(s) renamed to camelCase",
    blockedMessage: (finding) => `'${finding.from}' cannot be renamed to '${finding.to}': ${finding.reason ?? ""}`,
    checks: defineCheck({ detects: [], enforces: ["architecture:standardization"] }),
    editsByFile: buildEdits,
    findings: collect(),
    gateOnBlocked: false,
    label: (finding) => `${finding.from} → ${finding.to}`,
    programCount: CODEMOD_TSCONFIGS.length,
    ruleId: RULE_ID,
});
