import type {
    Axis,
    DerivationLoop,
    MathType,
    ReasonEdge,
    ReasonLayer,
    ReasonNode,
    Substrate,
    SubstrateNode,
} from "#types/reason.node.types";
import type {
    Dimension,
    Lens,
    MathDomain,
    Mode,
    Model,
    PatternType,
    ReasonMaps,
    Representation,
    UniversalAxis,
} from "#types/reason.concept.types";
import type { FailureShape, Invariant, Technique, TestSurface } from "#types/reason.surface.types";
import type { CheckFacet } from "#types/check.types";
import type { DanglingField } from "#types/field.types";
import type { Logger } from "#types/ontology.types";
import type { UnreadKey } from "#types/record.types";

export interface ReasonData {
    layers: ReasonLayer[];
    mathTypes: MathType[];
    axes: Axis[];
    nodes: ReasonNode[];
    substrate: Substrate;
    derivationLoop: DerivationLoop;
    edges: ReasonEdge[];
    dimensions: Dimension[];
    lenses: Lens[];
    modes: Mode[];
    representations: Representation[];
    mathDomains: MathDomain[];
    patternTypes: PatternType[];
    models: Model[];
    universalAxes: UniversalAxis[];
    testSurfaces: TestSurface[];
    techniques: Technique[];
    invariants: Invariant[];
    failureShapes: FailureShape[];
    maps: ReasonMaps;
}

export type CollectionKind =
    | "axis"
    | "dimension"
    | "failure-shape"
    | "invariant"
    | "layer"
    | "lens"
    | "loop"
    | "math-domain"
    | "math-type"
    | "mode"
    | "model"
    | "node"
    | "pattern-type"
    | "representation"
    | "substrate-node"
    | "technique"
    | "test-surface"
    | "universal-axis";

export interface ReasonResolution {
    kind: CollectionKind;
    record: unknown;
}

export interface ReasonOntologyIssues {
    duplicateIds: string[];
    danglingConcepts: { node: string; concept: string }[];
    danglingFields: DanglingField[];
    emptyFields: { kind: string; id: string; field: string }[];
    danglingTransitions: { from: string; to: string; reason: string }[];
    danglingEdgeSources: string[];
    collidingSurfaceCells: { cell: string; surfaces: string[] }[];
    answerShapeMismatches: { node: string; answerShape: string; allowed: string }[];
    unresolvedModelSteps: { model: string; step: string; stepKind: string }[];
    total: number;
}

export interface ConceptIndexes {
    dimension: Map<string, Dimension>;
    lens: Map<string, Lens>;
    mode: Map<string, Mode>;
    representation: Map<string, Representation>;
}

export interface ReasonIndexes {
    node: Map<string, ReasonNode>;
    axis: Map<string, Axis>;
    layer: Map<string, ReasonLayer>;
    mathType: Map<string, MathType>;
    concepts: ConceptIndexes;
    mathDomain: Map<string, MathDomain>;
    patternType: Map<string, PatternType>;
    model: Map<string, Model>;
    universalAxis: Map<string, UniversalAxis>;
    substrateNode: Map<string, SubstrateNode>;
    testSurface: Map<string, TestSurface>;
    technique: Map<string, Technique>;
    invariant: Map<string, Invariant>;
    failureShape: Map<string, FailureShape>;
}

export interface ReasonOntologyOptions {
    logger?: Logger | undefined;
    data?: ReasonData;
}

export interface ReasonOntology {
    checkOf: (kind: string, id: string) => CheckFacet | null;
    layers: () => ReasonLayer[];
    mathTypes: () => MathType[];
    mathType: (id: string) => MathType | null;
    axes: () => Axis[];
    axis: (id: string) => Axis | null;
    nodes: (axis?: string) => ReasonNode[];
    node: (id: string) => ReasonNode | null;
    substrate: () => Substrate;
    derivationLoop: () => DerivationLoop;
    edges: () => ReasonEdge[];
    dimensions: () => Dimension[];
    lenses: () => Lens[];
    modes: () => Mode[];
    representations: () => Representation[];
    mathDomains: () => MathDomain[];
    patternTypes: () => PatternType[];
    models: () => Model[];
    universalAxes: () => UniversalAxis[];
    testSurfaces: () => TestSurface[];
    techniques: () => Technique[];
    invariants: () => Invariant[];
    failureShapes: () => FailureShape[];
    uncoveredCells: () => { dimension: string; lens: string }[];
    maps: () => ReasonMaps;
    conceptOf: (nodeId: string) => ReasonResolution | null;
    ids: () => string[];
    kindMembers: () => ReadonlyMap<string, ReadonlySet<string>>;
    resolve: (id: string) => ReasonResolution | null;
    unreadKeys: () => UnreadKey[];
    validateReasonOntology: () => ReasonOntologyIssues;
}
