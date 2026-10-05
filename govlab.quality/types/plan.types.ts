export interface ToolResolution {
    knobs: Record<string, unknown>;
    disabledSurfaces: string[];
    enabledIntents: string[];
}

export type PerTool = Record<string, ToolResolution>;

export interface ResolvedPlan {
    perToolConfig: PerTool;
}

export type ConflictKind =
    | "channel-mismatch"
    | "known-bad-pair"
    | "ownership-overlap"
    | "unknown-setting"
    | "unsatisfiable-on-fixed"
    | "value-out-of-range";

export interface Conflict {
    kind: ConflictKind;
    surface?: string | undefined;
    canonicalId?: string | undefined;
    detail: string;
    options?: string[] | undefined;
}

export interface ConflictReport {
    conflicts: Conflict[];
}
