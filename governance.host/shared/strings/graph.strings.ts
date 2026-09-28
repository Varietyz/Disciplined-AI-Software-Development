export const malformedClosureGraph = function malformedClosureGraph(
    location: string,
    fields: readonly string[],
): string {
    return `closure graph: ${location} is missing one of the fields ${fields.join(", ")}. Rebuild the graph through the closure entry point.`;
};
