import type { Significance, Uniformity } from "#types/baseline.types";
import type { AnalysisTag } from "#types/axis.types";
import type { Finding } from "#types/finding.types";
import type { Rng } from "#types/seed.types";

export interface Accumulator<S> {
    update: (chunk: readonly unknown[]) => void;
    result: () => S;
    sample: (rng: Rng) => unknown;
}

export interface RepresentationRuntime {
    update: (chunk: readonly unknown[]) => void;
    findings: () => Finding[];
    sample: (rng: Rng) => unknown;
}

export interface RepresentationDefinition {
    name: string;
    applicable: readonly AnalysisTag[];
    create: (field: string) => RepresentationRuntime;
}

export interface DriftContext {
    indexSum: ReadonlyMap<string, number>;
    total: number;
    limit: number;
}

export interface LiftContext {
    records: number;
    limit: number;
}

export interface NumericBounds {
    low: number;
    high: number;
    total: number;
    weighted: number;
}

export interface OutlierContext {
    mean: number;
    stddev: number;
    limit: number;
}

export interface Temporal {
    first: string;
    last: string;
    byMonth: [number, number][];
}

export interface DistributionSummary {
    field: string;
    count: number;
    distinct: number;
    entropyBits: number;
    top: [string, number][];
    witnesses: [string, number][];
    overdue: [string, number][];
    uniformity: Uniformity;
    hot: [string, number][];
    cold: [string, number][];
    drift: [string, number][];
    temporal: Temporal | null;
    complexity: number;
    modeAccuracy: number;
}

export interface VectorSummary {
    field: string;
    count: number;
    minimum: number;
    maximum: number;
    mean: number;
    stddev: number;
    outliers: [number, number, number][];
    autocorrelation: number;
}

export interface SequenceSummary {
    field: string;
    count: number;
    distinct: number;
    longestRun: number;
    changeRatio: number;
    meanRun: number;
    topTransitions: [[string, string], number][];
    lastValue: string | null;
    nextValue: [string, number][];
    runLengths: [number, number][];
    markovAccuracy: number;
    transitionSignificance: Significance;
}

export interface GridSummary {
    field: string;
    points: number;
    distinctCells: number;
    densestCell: string;
    densestCount: number;
}

export interface TreeSummary {
    field: string;
    records: number;
    maxDepth: number;
    totalNodes: number;
    totalLeaves: number;
    maxBranching: number;
    distinctShapes: number;
    keys: [string, number][];
    paths: [string, number][];
    leafTypes: [string, number][];
}

export interface OrderedStats {
    adjacencyRate: number;
    symmetry: number;
    bands: number[];
}

export interface Composition {
    oddRatio: number;
    highRatio: number;
}

export interface GraphSummary {
    field: string;
    records: number;
    edges: number;
    distinctTargets: number;
    maxDegree: number;
    meanDegree: number;
    topPairs: [string[], number][];
    topMembers: [string, number][];
    memberUniformity: Uniformity;
    topLift: [string[], number][];
    composition: Composition | null;
    positional: [number, string, number][];
    distinctSets: number;
    repeatRate: number;
    ordered: OrderedStats | null;
    slotPatterns: [number, string, string, number][];
}
