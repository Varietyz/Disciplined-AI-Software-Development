export interface RaiseOutcome {
    readonly code: number;
    readonly message: string;
    readonly raised: string | null;
}

export interface Deferring {
    readonly names: string[];
    readonly clauses: string[];
}

export interface RaiseRequest {
    readonly repoRoot: string;
    readonly declared: string | null;
    readonly seats: readonly string[];
}

export interface RaisePlan {
    readonly invariant: string;
    readonly name: string;
    readonly destination: string;
    readonly template: string;
    readonly venueRoot: string;
}
