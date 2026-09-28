export const sourceSummary = function sourceSummary(
    applied: boolean,
    counts: { readonly files: number; readonly kept: number; readonly removed: number; readonly scanned: number },
    report: string,
): string {
    return (
        `${applied ? "CLEANED" : "PREVIEW"}  scanned=${String(counts.scanned)} ` +
        `files=${String(counts.files)} removed=${String(counts.removed)} ` +
        `attributionKept=${String(counts.kept)}\n` +
        `report: ${report}\n`
    );
};
