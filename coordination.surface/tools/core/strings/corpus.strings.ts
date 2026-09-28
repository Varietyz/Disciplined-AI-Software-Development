export const rewroteLine = function rewroteLine(rewritten: number, moves: number): string {
    return `rewrote ${String(rewritten)} references from ${String(moves)} recorded moves\n`;
};

export const noMovesList = function noMovesList(report: string): string {
    return `${report} carries no readable moves list. Run the corpus preview again to write it.`;
};

export const appliedOutcome = function appliedOutcome(rewritten: number): string {
    return `applied, references rewritten=${String(rewritten)}`;
};

export const PREVIEW_ONLY = "preview only";

export const corpusSummary = function corpusSummary(
    head: string,
    facets: string,
    variants: string,
    report: string,
    closing: string,
): string {
    return `${head}\nfacets: ${facets}\nvariants: ${variants}\nreport: ${report}\n${closing}`;
};

export const corpusHead = function corpusHead(
    verdict: string,
    resolved: number,
    findings: number,
    outcome: string,
): string {
    return `${verdict}  resolved=${String(resolved)} findings=${String(findings)} ${outcome}`;
};
