export interface FindingsStats {
    byKind: Map<string, number>;
    bySeverity: Map<string, number>;
    modules: number;
    modulesWithFindings: number;
    topModules: { module: string; total: number }[];
    total: number;
}
