export const skippedLine = function skippedLine(key: string, reason: string): string {
    return `   ! skipped ${key} — ${reason}\n`;
};

export const cleanedLine = function cleanedLine(file: string): string {
    return `   cleaned ${file}\n`;
};

export const extractedLine = function extractedLine(file: string): string {
    return `   extracted ${file}\n`;
};

export const stripSummary = function stripSummary(cleaned: number, scanned: number): string {
    return `\nDone — cleaned comments from ${String(cleaned)} of ${String(scanned)} scanned files\n\n`;
};

export const extractSummary = function extractSummary(added: number, out: string): string {
    return `\nDone — extracted ${String(added)} new comment(s) to ${out}\n\n`;
};

export const keepModeLine = "\nClean Comments — mode 'keep': comments left in place; drift from code is accepted.\n\n";

export const modeLine = function modeLine(mode: string, root: string): string {
    return `\nClean Comments — mode '${mode}' over ${root}\n\n`;
};

export const commentFailure = function commentFailure(detail: string): string {
    return `Clean comments failed: ${detail}\n`;
};
