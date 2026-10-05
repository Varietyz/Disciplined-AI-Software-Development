export const unmatchedBarrels = function unmatchedBarrels(lines: readonly string[]): string {
    return [
        `closure-graph: ${String(lines.length)} import.meta.glob pattern(s) match no files. A barrel that collects nothing registers nothing, and every consumer of it gets an empty registry:`,
        ...lines.map((line) => `  ${line}`),
    ].join("\n");
};

export const unmatchedPattern = function unmatchedPattern(barrel: string, pattern: string): string {
    return `${barrel}  →  ${pattern}`;
};

export const graphLine = function graphLine(counts: Readonly<Record<string, number>>): string {
    const parts = Object.entries(counts).map(([label, count]) => `${String(count)} ${label}`);
    return `closure-graph: ${parts.join(", ")}\n`;
};
