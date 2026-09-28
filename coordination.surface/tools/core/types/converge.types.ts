export interface Edge {
    readonly step: string;
    readonly edge: string;
    readonly holds: boolean;
    readonly detail: string;
}

export interface ClauseLine {
    readonly clause: string;
    readonly receiver: string;
}

export interface DeferredSection {
    readonly declared: boolean;
    readonly answered: boolean;
    readonly clauses: readonly string[];
}

export interface Absorption {
    readonly checklist: string;
    readonly open: readonly string[];
    readonly closes: string;
    readonly declaring: readonly string[];
}

export interface SuccessorView {
    readonly declared: string;
    readonly successor: string;
    readonly successorText: string;
    readonly deferred: DeferredSection;
    readonly unarrived: readonly string[];
    readonly elsewhere: readonly string[];
    readonly scheduled: boolean;
}
