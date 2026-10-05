export const goSummary = function goSummary(module: string, funcs: number, nodes: number): string {
    return `${module}: go — ${funcs} funcs, ${nodes} nodes`;
};

export const unresolvedCalls = function unresolvedCalls(module: string, count: number): string {
    return `${module}: ${count} unresolved call(s) pruned`;
};
