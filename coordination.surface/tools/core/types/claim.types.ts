export interface Contention {
    readonly key: string;
    readonly cited: string;
    readonly stamped: number;
    readonly moved: number;
}

export interface RunClaim {
    readonly id: string;
    readonly scope: string;
    readonly at: number;
    readonly agent: string;
    readonly pid: number;
    readonly host: string;
}

export interface ClaimStanding {
    readonly decision: "proceed" | "yield";
    readonly covering: readonly string[];
    readonly overlapping: readonly string[];
    readonly incomplete: readonly string[];
    readonly message: string | null;
}
