import type { Finding } from "./segment.types.ts";

export type GateState = "exempt" | "noisy" | "proven" | "silent" | "untested";

export interface GateOutcome {
    readonly rule: string;
    readonly state: GateState;
    readonly detail: string;
}

export interface Counted {
    readonly findings: readonly Finding[];
    readonly error: string | null;
}
