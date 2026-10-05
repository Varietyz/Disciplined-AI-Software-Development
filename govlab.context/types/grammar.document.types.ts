export interface PagPopulation {
    set: string;
    measured: string;
    whole: string;
}

export interface PagCheck {
    marker: string;
    condition: string;
    evidence: string | null;
    population: PagPopulation | null;
    line: number;
}

export interface PagFailureArm {
    name: string;
    owner: string;
}

export interface PagResult {
    pass: string;
    failures: PagFailureArm[];
    unknown: string | null;
    line: number;
}

export interface PagGate {
    checks: PagCheck[];
    refusal: string | null;
    standing: string | null;
    result: PagResult | null;
    line: number;
}

export interface PagNodeTag {
    layer: string;
    axis: string;
    mathType: string;
    yields: string;
}

export interface PagNode {
    header: string;
    title: string;
    number: string | null;
    head: string;
    tag: PagNodeTag | null;
    genesis: string | null;
    purpose: string | null;
    cue: string | null;
    input: string | null;
    transform: string | null;
    freshness: string | null;
    directives: string[];
    gate: PagGate | null;
    line: number;
}

export type PagNodeField = "cue" | "freshness" | "genesis" | "input" | "purpose" | "transform";

export interface PagNodeFieldValue {
    field: PagNodeField;
    value: string;
}

export interface PagDeclaration {
    type: string | null;
    verb: string | null;
    description: string;
    line: number;
}

export interface PagInvariant {
    name: string;
    property: string;
    set: string | null;
    parties: string | null;
    objector: string | null;
    line: number;
}

export interface PagReport {
    fields: Record<string, string>;
    line: number;
}

export type PagRetiredKind = "check" | "gate" | "invariant" | "unit";

export interface PagRetired {
    kind: PagRetiredKind;
    token: string;
    line: number;
}

export interface PagDocument {
    frontmatter: string | null;
    declaration: PagDeclaration | null;
    meta: Record<string, string>;
    nodes: PagNode[];
    invariants: PagInvariant[];
    retired: PagRetired[];
    report: PagReport | null;
}

export type PagDefectCode =
    | "artifact_without_freshness"
    | "bare_invariant_block"
    | "check_without_evidence"
    | "empty_population"
    | "for_without_each"
    | "gate_too_few_conditions"
    | "gate_too_many_conditions"
    | "gate_without_population"
    | "input_without_source"
    | "invariant_without_objector"
    | "invariant_without_parties"
    | "invariant_without_set"
    | "lowercase_keyword"
    | "missing_colon"
    | "no_declaration"
    | "node_declared_twice"
    | "node_tag_malformed"
    | "node_without_gate"
    | "result_missing"
    | "retired_unit_head"
    | "template_without_block"
    | "unknown_unrouted"
    | "vague_condition"
    | "write_without_refusal";

export interface PagDefect {
    code: PagDefectCode;
    line: number;
    token: string;
}

export interface ValidateResult {
    wellFormed: boolean;
    defects: PagDefect[];
}

export interface TemplateResolveResult {
    text: string;
    unresolved: string[];
    violations: string[];
}

export interface MarkerHit {
    marker: string;
    retired: boolean;
}

export interface GateStep {
    gate: PagGate;
    consumed: boolean;
    closes: boolean;
    retired: PagRetired | null;
}

export interface FrontmatterRead {
    end: number;
    frontmatter: string | null;
}

export type HeaderKind = "comment" | "invariants" | "node" | "repair" | "retired-unit";

export interface ParsedHeader {
    kind: HeaderKind;
    head: string;
    number: string | null;
    title: string;
    tag: PagNodeTag | null;
}

export type DocumentKind = "agent" | "template";

export interface DocumentSource {
    readonly kind: DocumentKind;
    readonly path: string;
    readonly relative: string;
}

export interface PagText {
    readonly text: string;
    readonly firstLine: number;
}

export interface DocumentVerdict {
    readonly source: DocumentSource;
    readonly defects: readonly PagDefect[];
    readonly extracted: boolean;
}
