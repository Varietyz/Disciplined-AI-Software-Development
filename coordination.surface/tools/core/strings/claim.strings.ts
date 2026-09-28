export const runsInFlight = function runsInFlight(yields: boolean, runs: readonly string[]): string {
    return (
        `${yields ? "This run yields" : "This run proceeds"}: ${String(runs.length)} other run(s) are in progress ` +
        `(${runs.join("; ")}). The run that started first goes ahead, and the seat letter breaks an exact tie. A ` +
        "caller that wants the result reads that run's report once it is published; a caller that wants repairs " +
        "runs again after it finishes"
    );
};

export const runsAbandoned = function runsAbandoned(runs: readonly string[]): string {
    return (
        `${String(runs.length)} earlier run(s) stopped without a verdict: ${runs.join("; ")}. Reports older than ` +
        "them may describe a tree they never finished measuring. Their claims were removed, because each is outside " +
        "the live window and its process is no longer running"
    );
};

export const RELEASE_UNIDENTIFIED =
    "REFUSED  This release names no run, so no claim was removed. Removing every claim would also end the claims " +
    "of runs still in progress";
