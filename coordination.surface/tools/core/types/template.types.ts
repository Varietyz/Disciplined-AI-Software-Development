export interface TemplateContract {
    readonly genesisStages: readonly string[];
    readonly rippleDimensions: readonly string[];
    readonly dependencyAxes: readonly string[];
    readonly confidenceThreshold: number;
}
