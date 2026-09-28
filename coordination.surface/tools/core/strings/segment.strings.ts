export const segmentCounts = function segmentCounts(
    scanned: number,
    hits: number,
    edits: number,
    rejected: number,
): string {
    return `scanned=${String(scanned)} hits=${String(hits)} edits=${String(edits)} rejected=${String(rejected)}`;
};

export const rehearsalLine = function rehearsalLine(flag: string): string {
    return `rehearsal only: rerun without ${flag} to write\n`;
};

export const segmentSummary = function segmentSummary(
    verdict: string,
    counts: string,
    report: string,
    rehearsed: string,
): string {
    return `${verdict}  ${counts}\nreport: ${report}\n${rehearsed}`;
};
