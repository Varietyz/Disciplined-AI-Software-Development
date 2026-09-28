import type { JoinedRun } from "../types/pipeline.types.ts";

export const otherRuns = function otherRuns(message: string): string {
    return `OTHER RUNS  ${message}\n`;
};

export const UNATTRIBUTED =
    "UNATTRIBUTED  This run names no calling seat, so its report and its write claim name no seat a peer can ask. " +
    "Pass --agent <LETTER> to attribute the run. The run continues.\n";

export const healingHeld = function healingHeld(count: number, runs: readonly string[]): string {
    return (
        `HEALING HELD  ${String(count)} live run(s) write files this run would also write: ${runs.join("; ")}. ` +
        "This run reports and repairs nothing, so neither run overwrites the other. Run it again once the other " +
        "run has finished to get the repairs.\n"
    );
};

export const JOINED =
    "JOINED  A run that started earlier is measuring the same files, so this run does not measure them again. It " +
    "wrote no report and released its claim. The result below is the earlier run's.\n";

export const covered = function covered(count: number, runs: readonly string[]): string {
    return (
        `COVERED  ${String(count)} live run(s) already measure this scope: ${runs.join("; ")}. This run wrote ` +
        "nothing and released its claim. The result below is the covering run's, printed once it is published.\n"
    );
};

export const wroteOutsideScope = function wroteOutsideScope(paths: readonly string[]): string {
    return (
        `WROTE OUTSIDE ITS SCOPE  ${paths.join(", ")}. This run wrote files outside the scope it declared, so a ` +
        "peer that stayed clear of that scope was not protected from it.\n"
    );
};

export const claimedUnwritten = function claimedUnwritten(paths: readonly string[]): string {
    return (
        `CLAIMED A WRITE THAT DID NOT HAPPEN  ${paths.join(", ")}. The run reports repairing these files, and ` +
        "their contents did not change.\n"
    );
};

export const scopeUnresolved = function scopeUnresolved(scope: string): string {
    return (
        `REFUSED  The scope ${scope} matches no path, so this run measured nothing and wrote no report. A scope is ` +
        "resolved from the project root, so include any folder prefix in the path.\n"
    );
};

export const BYPASSED_RUN = "A run that bypassed a check does not count as a complete run.\n";

export const repairedWhileReading = function repairedWhileReading(paths: readonly string[]): string {
    return (
        `REPAIRED WHILE READING  ${paths.join(", ")}. These files changed because this run repaired them, so they ` +
        "do not make the verdict contended. A file this run repaired and a peer also wrote cannot be told apart " +
        "from one only this run repaired.\n"
    );
};

export const runContended = function runContended(count: number, paths: readonly string[]): string {
    return (
        `CONTENDED  ${String(count)} file(s) changed while this run was reading, so the verdict is not ` +
        `authoritative. Run it again once the other write has finished: ${paths.join(", ")}\n`
    );
};

export const narrowedRun = function narrowedRun(scope: string, aggregate: string): string {
    return (
        `Narrowed run (scope=${scope}): this result is printed only. ${aggregate} still holds the last full run ` +
        "and remains the only report.\n"
    );
};

export const notMeasured = function notMeasured(rules: readonly string[]): string {
    return (
        `NOT MEASURED  ${rules.join(", ")}. A narrowed run skips these checks for one of three reasons:\n` +
        "  - the check reads its subjects from a declared list and its evidence from the scanned files, so a " +
        "narrowed scope would remove the evidence and report false failures;\n" +
        "  - the check reads a fixed population outside this scope, so its result would not describe this scope;\n" +
        "  - the check deletes files from a list the scope does not limit.\n" +
        "Run the full scope to measure them.\n"
    );
};

export const joinedResult = function joinedResult(run: JoinedRun, report: string): string {
    return (
        `${run.verdict.toUpperCase()}  The joined run has published: scope ${run.scope}, run by ${run.agent}, ` +
        `${String(run.findings)} finding(s). This is that run's result. Details are in ${report}.\n`
    );
};

export const JOIN_ABANDONED =
    "ABANDONED  The joined run did not publish within the join window, so there is no result to show. It may " +
    "have stopped; the next run removes its claim and measures the tree itself.\n";

export const SUPERSEDED =
    "SUPERSEDED  The report on disk comes from a run that started after this one, so this result is printed and " +
    "not written. An older result never replaces a newer one.\n";

export const STREAMED =
    "STREAMED  This result is printed and not written. Only a full-scope run writes the report, so the report on " +
    "disk still holds the last full run.\n";
