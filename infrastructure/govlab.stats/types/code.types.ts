export interface AnalysisStats {
    byFlow: Map<string, number>;
    definitions: number;
    edges: number;
    modulesAnalyzed: number;
    producer: string;
    resolutionRate: number;
    topByDefinitions: { definitions: number; module: string }[];
    unresolvedCalls: number;
}

export interface ModuleAnalysis {
    definitions: number;
    edges: number;
    flows: string[];
    module: string;
    unresolvedCalls: number;
}
