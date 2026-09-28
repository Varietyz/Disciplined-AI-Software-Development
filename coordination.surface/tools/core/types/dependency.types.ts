export interface DependencyReach {
    readonly declared: readonly string[];
    readonly reached: readonly string[];
    readonly unreached: readonly string[];
    readonly undetermined: readonly string[];
    readonly corpus: readonly string[];
}
