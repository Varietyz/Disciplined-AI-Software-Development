export interface PhaseSpan {
    readonly title: string;
    readonly line: number;
    readonly text: string;
    readonly band: string;
}

export interface Breach {
    readonly kind: string;
    readonly line: number;
    readonly locus: string;
    readonly actual: string;
    readonly expected: string;
}

export interface SurfaceReport {
    readonly breaches: readonly Breach[];
    readonly derivations: Record<string, unknown>;
}

export interface IdBreach {
    readonly kind: string;
    readonly line: number;
    readonly id: string;
    readonly actual: string;
    readonly expected: string;
}

export interface Counted {
    readonly milestones: number;
    readonly phases: number;
    readonly tasks: number;
}

export interface Block {
    readonly line: number;
    readonly text: string;
}

export interface Phase {
    readonly line: number;
    readonly title: string;
}

export interface ProtocolFinding {
    readonly kind: string;
    readonly line: number;
    readonly locus: string;
    readonly actual: string;
    readonly expected: string;
}
