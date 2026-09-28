export interface PrincipleWalk {
    readonly declared: number;
    readonly cited: number;
    readonly uncited: readonly string[];
    readonly danglingCitations: readonly string[];
}
