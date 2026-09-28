export interface StateDrift {
    readonly letter: string;
    readonly line: number;
    readonly marker: string;
    readonly bound: string;
}

export interface CompressOutcome {
    readonly message: string;
    readonly code: number;
    readonly excised: readonly string[];
    readonly write: string | null;
}

export interface Witnessed {
    readonly absolute: string;
    readonly agent: string;
    readonly target: string;
    readonly before: string;
    readonly written: string;
}

export interface SpanConflict {
    readonly overlapping: boolean;
    readonly added: readonly string[];
    readonly removed: readonly string[];
}

export interface Waiter {
    readonly id: string;
    readonly agent: string;
    readonly expiresAt: number;
}

export interface BoardContract {
    readonly agentFields: readonly string[];
    readonly gateFields: readonly string[];
}

export interface Admission {
    readonly id: string;
    readonly message: string;
    readonly code: number;
}

export interface AddressingSite {
    readonly line: number;
    readonly opener: string;
}

export interface Delimiter {
    readonly agent: string;
    readonly open: boolean;
    readonly line: number;
}

export interface Compression {
    readonly text: string;
    readonly fields: number;
    readonly removed: number;
    readonly excised: readonly string[];
}

export interface Span {
    readonly from: number;
    readonly to: number;
}

export type RecordKind = "agent" | "gate";

export interface BoardRecord {
    readonly kind: RecordKind;
    readonly label: string;
    readonly state: string;
    readonly line: number;
    readonly fields: ReadonlyMap<string, string>;
}
