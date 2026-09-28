export interface RepairScope {
    readonly repoRoot: string;
    readonly declared: string;
    readonly claimed?: boolean;
}

export interface RepairOutcome {
    readonly written: boolean;
    readonly refusal: string | null;
}
