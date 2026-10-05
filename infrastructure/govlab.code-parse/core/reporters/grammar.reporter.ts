import type { BuildKind, BuildResult } from "#types/grammar.types";
import {
    SKIPPED_PREFIX,
    WASM_UNBUILT_PREFIX,
    builtSummary,
    fetchFailedNote,
    noteLine,
} from "#configuration/strings/grammar.strings";
import process from "node:process";

const printNotes = function printNotes(results: readonly BuildResult[], kind: BuildKind, prefix: string): void {
    for (const entry of results.filter((result) => result.kind === kind)) {
        process.stdout.write(noteLine(prefix, entry.note));
    }
};

export const reportBuild = function reportBuild(results: readonly BuildResult[]): boolean {
    const built = results.filter((result) => result.kind === "built").map((result) => result.lang);
    process.stdout.write(builtSummary(built));
    printNotes(results, "skipped", SKIPPED_PREFIX);
    printNotes(results, "wasm-failed", WASM_UNBUILT_PREFIX);
    const fetchFailed = results.filter((result) => result.kind === "fetch-failed");
    for (const result of fetchFailed) {
        process.stderr.write(fetchFailedNote(result.note));
    }
    return fetchFailed.length === 0;
};
