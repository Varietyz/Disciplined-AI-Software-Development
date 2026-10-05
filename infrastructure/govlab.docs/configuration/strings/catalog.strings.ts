export const barrelHeading = function barrelHeading(concern: string): string {
    return `# ${concern} — doc-arch index`;
};

export const barrelSection = function barrelSection(type: string): string {
    return `## ${type}`;
};

export const barrelEntry = function barrelEntry(name: string, target: string, summary: string, marker: string): string {
    return `- [\`${name}\`](../${target}) — ${summary}${marker}`;
};

export const SUPERSEDED_MARKER = " _(superseded)_";

export const catalogSummary = function catalogSummary(parts: {
    concerns: number;
    cycles: number;
    deadEdges: number;
    docs: number;
    healed: number;
    pruned: number;
    superseded: number;
}): string {
    return `govlab.docs generate: ${parts.docs} doc(s), ${parts.concerns} concern barrel(s), ${parts.healed} regenerated, ${parts.pruned} pruned, ${parts.deadEdges} dead-edge(s), ${parts.cycles} cycle(s), ${parts.superseded} superseded`;
};
