import type { CheckDeclarationDefect, SecondCheckHome, UncheckedRecord, UnresolvedCheckRef } from "#types/check.types";
import type { UnresolvedConceptRef, VariantId } from "#types/concept.types";
import type { TensionGap } from "#types/layer.types";
import type { UnreadKey } from "#types/record.types";

export interface MisspelledForce {
    record: string;
    token: string;
    canonical: string;
}

export interface CrossFaceIssues {
    unknownForces: string[];
    misspelledForces: MisspelledForce[];
    danglingPrincipleRefs: string[];
}

export interface UnresolvedEdge {
    from: string;
    relation: string;
    target: string;
}

export interface RelationKindViolation {
    from: string;
    relation: string;
    target: string;
    kind: string;
    allowed: string[];
}

export interface LexDefect {
    id: string;
    reason: string;
}

export interface KindConsistencyViolation {
    id: string;
    declaredKind: string;
    signalsKind: string;
    opening: string;
}

export interface ExemplarGap {
    id: string;
    reason: string;
}

export interface EmptyRequiredField {
    collection: string;
    field: string;
    id: string;
}

export interface InvalidSeverity {
    id: string;
    reason: string;
}

export interface AsciiArrow {
    collection: string;
    field: string;
    id: string;
}

export interface AdjacentPair {
    a: string;
    b: string;
    kind: string;
    basis: string;
}

export interface InvalidDistinct {
    from: string;
    target: string;
    reason: string;
}

export interface AliasDefect {
    alias: string;
    reason: string;
    ref: string;
}

export interface RepairDefect {
    field: string;
    reason: string;
    ref: string;
    target: string;
}

export interface AliasHolder {
    readonly aliases: readonly string[];
    readonly collection: string;
    readonly distinct: ReadonlySet<string>;
    readonly names: readonly string[];
    readonly ref: string;
}

export interface ReasonNativeIssues {
    invalidStages: { id: string; stage: string }[];
    invalidAxes: { id: string; axis: string }[];
    invalidMathTypes: { id: string; mathType: string }[];
    stageAxisMismatches: { id: string; stage: string; axis: string; expected: string }[];
    yieldsShapeMismatches: { id: string; mathType: string; yields: string; allowed: string }[];
    derivationMapDefects: { id: string; reason: string }[];
    untypedRecords: string[];
    unstagedProcessRecords: string[];
    duplicateLoopGroundings: { domain: string; records: string[] }[];
    metaLoopGroundings: string[];
    metaKernelNaming: string[];
    subtotal: number;
}

export interface IntegrityIssues {
    intraGrammarDivergentSymbols: { name: string; grammar: string; definedIn: string[] }[];
    crossCatalogRedundancy: { a: string; b: string }[];
    invalidDistinctDeclarations: InvalidDistinct[];
    liveSymbolCount: number;
    indexedSymbolCount: number;
    symbolIndexStale: boolean;
    subtotal: number;
}

export interface ResolutionIssues {
    duplicateIds: string[];
    unresolvedArchEdges: UnresolvedEdge[];
    unresolvedAlgoComposes: { from: string; target: string }[];
    relationKindViolations: RelationKindViolation[];
    crossFaceIdCollisions: string[];
    ambiguousReasonRefs: { from: string; kinds: string[]; target: string }[];
    idShapedEdgeLabels: { from: string; label: string }[];
    lexDefects: LexDefect[];
    tagExampleDefects: LexDefect[];
    kindConsistencyViolations: KindConsistencyViolation[];
    exemplarGaps: ExemplarGap[];
    uncheckedRecords: UncheckedRecord[];
    unresolvedCheckRefs: UnresolvedCheckRef[];
    checkDeclarationDefects: CheckDeclarationDefect[];
    secondCheckHomes: SecondCheckHome[];
    uncoveredCollections: string[];
    emptyRequiredFields: EmptyRequiredField[];
    invalidSeverities: InvalidSeverity[];
    asciiArrows: AsciiArrow[];
    undeclaredAdjacentPairs: AdjacentPair[];
    invalidRecordDistincts: InvalidDistinct[];
    aliasDefects: AliasDefect[];
    repairDefects: RepairDefect[];
    unreachableAntiPatterns: string[];
    unresolvedTensions: TensionGap[];
    deadResolutionSeeds: TensionGap[];
    unresolvedReasonEdges: string[];
    unresolvedShapeInstances: { shape: string; instance: string }[];
    unresolvedLensDetectors: { lens: string; target: string }[];
    unresolvedGrammarGrounds: { from: string; target: string }[];
    unresolvedPagGrounds: { from: string; target: string }[];
    unresolvedExpressions: { from: string; target: string }[];
    ungroundedPagConstructs: string[];
    doctypeModelAxis: string[];
    ungroundedGates: string[];
    reasonOntologyDefects: string[];
    duplicateKeywordIds: string[];
    danglingTemplateSlots: { type: string; slot: string }[];
    docTypesWithoutVerb: string[];
    unknownTemplateTypes: string[];
    unrecognizedDocumentTypes: string[];
    unrecognizedDocumentVerbs: { type: string; verb: string }[];
    danglingNonterminals: { production: string; ref: string }[];
    unusedTerminals: string[];
    unknownRecordKeys: UnreadKey[];
    unresolvedConceptRefs: UnresolvedConceptRef[];
    variantIds: VariantId[];
    unknownForces: string[];
    misspelledForces: MisspelledForce[];
    danglingPrincipleRefs: string[];
    reasonNative: ReasonNativeIssues;
    integrity: IntegrityIssues;
    total: number;
}
