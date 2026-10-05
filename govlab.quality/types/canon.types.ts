export type Fidelity = "advisory" | "approximate" | "exact";

export interface CanonicalSettingRecord {
    id: string;
    kind: "rule-intent" | "value";
    surface: string;
    dimension: string;
    valueType: string;
    default: unknown;
}

export interface MappingRow {
    canonicalId: string;
    tool: string;
    langs: string[];
    knob: string | null;
    default: unknown;
    fidelity: Fidelity;
    fixed: boolean;
    ruleCount?: number;
    verified?: string;
    provenance?: { toolVersion: string; source: string };
}

export interface OwnershipSurface {
    id: string;
    ownerByLanguage: Record<string, string>;
    fixedOwners: string[];
    advisoryOwners?: string[];
    alternatives?: Record<string, string[]>;
}

export interface ConflictInstance {
    kind: "known-bad-pair" | "ownership-overlap" | "unsatisfiable-on-fixed" | "value-out-of-range";
    surface?: string;
    canonicalId?: string;
    tools?: string[];
    lang?: string;
    value?: unknown;
    resolution: string;
}

export interface CanonicalData {
    settings: CanonicalSettingRecord[];
    rows: MappingRow[];
    ownership: OwnershipSurface[];
    conflicts: ConflictInstance[];
}

export interface CanonicalConfig {
    languages: string[];
    values?: Record<string, unknown>;
    enabled?: Record<string, boolean>;
}

export interface ConceptKnob {
    knob: string | null;
    default?: unknown;
    fidelity: string | null;
    provenance?: string;
    fixed?: boolean;
    variant?: string;
}

export interface KnobConcept {
    valueType: string;
    tools: Record<string, ConceptKnob>;
    enum?: unknown;
}

export interface MappingEntry {
    default?: unknown;
    fidelity: string | null;
    knob: string | null;
    knobStatus?: string;
    lang: string[] | string;
    provenance?: string | undefined;
    ruleCount: number;
    ruleIds: string[];
    tool: string;
    verified: string;
    fixed?: boolean;
    variant?: string;
}

export interface MappingConcept {
    dimension: string;
    ruleCount: number;
    toolCount: number;
    valueType: string;
    enum?: unknown;
    entries: MappingEntry[];
}

export interface CanonDefects {
    algoForce: string[];
    algoId: string[];
    archEdge: string[];
    archId: string[];
    archRename: string[];
    archType: string[];
    unknownType: Set<string>;
}

export type OwnerOverride = Record<string, Record<string, string>>;

export interface OwnershipOverrideConflict {
    kind: "fixed-owner" | "tool-not-competitor" | "unknown-surface";
    surface: string;
    lang: string;
    detail: string;
}
