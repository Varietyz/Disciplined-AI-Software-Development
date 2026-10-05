export const GRAPH_LABELS = {
    constructs: "new",
    fails: "fail",
    guard: "guard",
    throws: "throw",
    writes: "writes",
} as const;

export const hookLabel = function hookLabel(event: string): string {
    return `hook ${event}`;
};
