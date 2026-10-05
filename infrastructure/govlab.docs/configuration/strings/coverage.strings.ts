export const COVERAGE_GAPS = {
    aiContext: "no-ai-context",
    capabilities: "no-capabilities",
    relationships: "no-relationships",
} as const;

export const coverageHeading = function coverageHeading(count: number): string {
    return `Workspace manifest completeness — ${count} modules\n`;
};

export const missingCapabilities = function missingCapabilities(count: number): string {
    return `  missing capabilities:            ${count}`;
};

export const missingAiContext = function missingAiContext(count: number): string {
    return `  public without AI-CONTEXT.md:    ${count}`;
};

export const withoutRelationships = function withoutRelationships(count: number): string {
    return `  without relationships:           ${count}  (informational — empty is often correct)\n`;
};

export const rankedRow = function rankedRow(slug: string, isPrivate: boolean, gaps: string): string {
    return `  ${slug}${isPrivate ? " [private]" : ""} — ${gaps}`;
};

export const COVERAGE_COMPLETE = "\n✓ complete (capabilities + AI-context).";

export const coverageGaps = function coverageGaps(count: number): string {
    return `\n${count} enrichment gap(s) (capabilities + AI-context).`;
};
