import type { AnatomyStats, DefinitionRef, DefinitionView, FindingView } from "@banes-lab/web/types/anatomy.types.js";
import type { CodeFinding, DefinitionRecord, ModuleReport } from "@govlab/patterns";
import type { DiskFile } from "#types/structure.types";

const KEY_SEPARATOR = "::";
const CYCLE_KIND = "call-cycle";

export const definitionKey = function definitionKey(file: string, name: string): string {
    return file + KEY_SEPARATOR + name;
};

const refOf = function refOf(key: string): DefinitionRef {
    const cut = key.lastIndexOf(KEY_SEPARATOR);
    return { file: key.slice(0, cut), id: key, name: key.slice(cut + KEY_SEPARATOR.length) };
};

const definitionView = function definitionView(record: DefinitionRecord): DefinitionView {
    return {
        callable: record.callable,
        callees: record.callees.map(refOf),
        callers: record.callers.map(refOf),
        exported: record.exported,
        file: record.file,
        flow: record.flow,
        id: definitionKey(record.file, record.name),
        inDegree: record.inDegree,
        kind: record.kind,
        line: record.line,
        local: record.local,
        name: record.name,
        outDegree: record.outDegree,
    };
};

export const definitionsByFile = function definitionsByFile(report: ModuleReport): Map<string, DefinitionView[]> {
    const byFile = new Map<string, DefinitionView[]>();
    for (const record of report.definitions) {
        byFile.set(record.file, [...(byFile.get(record.file) ?? []), definitionView(record)]);
    }
    return byFile;
};

export const findingView = function findingView(finding: CodeFinding): FindingView {
    return {
        confidence: finding.confidence,
        detail: finding.detail,
        file: finding.file,
        kind: finding.kind,
        line: finding.line,
        name: finding.name,
        remedy: finding.remedy,
        severity: finding.severity,
    };
};

export const flaggedOf = function flaggedOf(findings: readonly CodeFinding[]): Map<string, string> {
    const flagged = new Map<string, string>();
    for (const finding of findings) {
        if (finding.kind === CYCLE_KIND) {
            for (const member of finding.members) {
                flagged.set(member, finding.severity);
            }
        } else {
            flagged.set(definitionKey(finding.file, finding.name), finding.severity);
        }
    }
    return flagged;
};

const tally = function tally(values: readonly string[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const value of values) {
        counts[value] = (counts[value] ?? 0) + 1;
    }
    return counts;
};

export const fileStatsOf = function fileStatsOf(
    file: DiskFile,
    definitions: readonly DefinitionView[],
    edges: number,
    findings: readonly FindingView[],
): AnatomyStats {
    return {
        bytes: file.bytes,
        callable: definitions.filter((definition) => definition.callable).length,
        definitions: definitions.length,
        edges,
        exported: definitions.filter((definition) => definition.exported).length,
        files: 1,
        findings: tally(findings.map((finding) => finding.kind)),
        flows: tally(definitions.map((definition) => definition.flow)),
        lines: file.lines,
    };
};
