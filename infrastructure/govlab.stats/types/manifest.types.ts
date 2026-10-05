export interface WorkspaceStats {
    byAxis: Map<string, number>;
    byMaturity: Map<string, number>;
    missingDocs: string[];
    missingReadme: string[];
    total: number;
    withDocs: number;
    withGovernance: number;
    withReadme: number;
}

export interface ModuleInfo {
    rel: string;
    axis: string;
    maturity: string;
    hasDocs: boolean;
    hasReadme: boolean;
    governed: boolean;
}
