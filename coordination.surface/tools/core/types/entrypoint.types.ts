export interface RequestedOperation {
    readonly operation: string;
    readonly requested: boolean;
    readonly supplied: boolean;
    readonly refusal: string;
}

export interface Mutation {
    readonly target: string;
    readonly line: number;
    readonly reads: number;
    readonly witnessed: boolean;
}

export interface BranchOperand {
    readonly name: string;
    readonly line: number;
}

export interface PresenceBackedGuard {
    readonly guard: string;
    readonly reader: string;
    readonly line: number;
    readonly chain: readonly string[];
}
