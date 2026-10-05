export const PARALLEL_GROUP = "parallel group";

export const INDEX_FAILED =
    "verify-codebase: the local rule index could not be re-derived. Every later step reads it, so fix the indexer's output above and run the gate again.";

export const noQualityRoot = function noQualityRoot(config: string): string {
    return `verify-codebase: ${config} declares no qualityEngine.root, and the cross-file quality gate needs one. Set qualityEngine.root there.`;
};

export const REPORT_TABLE_HEAD = "| Stage | Steps ✓ | Steps ✖ | Violations counted |";

export const REPORT_TABLE_DIVIDER = "| --- | ---: | ---: | ---: |";

export const unknownMembers = function unknownMembers(unknown: readonly string[], known: readonly string[]): string {
    return `verify-codebase: unknown --member ${unknown.join(", ")}. Known ids: ${known.join(", ")}.`;
};

export const skippedWide = function skippedWide(labels: readonly string[]): string {
    return `verify-codebase: repo-wide step(s) not run under --member, they cannot be narrowed to one member: ${labels.join(", ")}\n`;
};

export const unknownSlugs = function unknownSlugs(
    label: string,
    unknown: readonly string[],
    known: readonly string[],
): string {
    return `${label}: unknown stage slug ${unknown.join(", ")}. Known slugs: ${known.join(", ")}.`;
};

export const concurrentGroup = function concurrentGroup(range: string, group: string, count: number): string {
    return `${range} ∥ ${group}: ${String(count)} concurrent`;
};

export const failedInGroup = function failedInGroup(failed: number, total: number, group: string): string {
    return `${String(failed)}/${String(total)} in "${group}"`;
};

export const failedTitle = function failedTitle(label: string): string {
    return `${label} FAILED`;
};

export const commandLine = function commandLine(command: string): string {
    return `  command: ${command}`;
};

export const notRunLine = function notRunLine(count: number): string {
    return `  ${String(count)} step(s) not run.`;
};

export const bypassNote = function bypassNote(count: number): string {
    return count > 0 ? `, ${String(count)} bypassed` : "";
};

export const scopeNote = function scopeNote(scope: readonly string[]): string {
    return `, scoped to ${scope.join(" + ")}`;
};

export const headerLine = function headerLine(label: string, total: number, stages: number): string {
    return `${label}: ${String(total)} steps across ${String(stages)} stage(s)`;
};

export const bypassedStage = function bypassedStage(label: string, slug: string): string {
    return `⤼ ${label} [${slug}] bypassed`;
};

export const allPassed = function allPassed(count: number): string {
    return `✔ all ${String(count)} steps passed`;
};

export const someFailed = function someFailed(failed: number, total: number): string {
    return `✖ ${String(failed)}/${String(total)} steps failed`;
};

export const totalsLine = function totalsLine(violations: string, elapsed: string): string {
    return `${violations} total violations counted, in ${elapsed}s`;
};

export const passedLine = function passedLine(label: string, total: number, elapsed: string): string {
    return `✔ ${label} passed: ${String(total)} steps in ${elapsed}s`;
};

export const violationsWritten = function violationsWritten(violations: number, files: number, target: string): string {
    return `  violations: ${String(violations)} across ${String(files)} file(s) in ${target}`;
};

export const reportWritten = function reportWritten(target: string): string {
    return `  report written: ${target}`;
};

export const stageHeading = function stageHeading(label: string, slug: string): string {
    return `▸ ${label} [${slug}]`;
};

export const stepLine = function stepLine(tag: string, label: string, command: string): string {
    return `${tag} ${label}: ${command}`;
};

export const elapsedNote = function elapsedNote(elapsed: string): string {
    return `(${elapsed}s)`;
};

export const exitNote = function exitNote(elapsed: string, code: number): string {
    return `(${elapsed}s, exit ${String(code)})`;
};

export const exitMark = function exitMark(code: number): string {
    return `✖ (exit ${String(code)})`;
};

export const countNote = function countNote(count: number): string {
    return `(${String(count)})`;
};

export const outputDivider = function outputDivider(label: string): string {
    return `--- ${label} ---`;
};

export const failedOutputDivider = function failedOutputDivider(stage: string, label: string, code: number): string {
    return `--- ${stage} / ${label} (exit ${String(code)}) ---`;
};

export const reportTitle = function reportTitle(label: string): string {
    return `${label}: full report (per-stage totals)`;
};

export const tableRow = function tableRow(stage: string, passed: number, failed: number, violations: string): string {
    return `| ${stage} | ${String(passed)} | ${String(failed)} | ${violations} |`;
};

export const PASS_MARK = "✓";

export const FAIL_MARK = "✖";
