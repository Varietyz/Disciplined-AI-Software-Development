import type { AnalysisTag, MathType } from "#types/axis.types";
import { MATH_TYPE_AXIS } from "#configuration/generated/axis.generated";

const LOGIC = "logic";
const GRAPH = "graph";
const ALGEBRA = "algebra";
const ANALYSIS = "analysis";
const OPTIMIZATION = "optimization";
const TOPOLOGY = "topology";
const PROBABILITY = "probability";
const INFORMATION_THEORY = "information-theory";
const DYNAMICAL_SYSTEMS = "dynamical-systems";

export const MATH_TYPES: ReadonlySet<string> = new Set(MATH_TYPE_AXIS);

export const ANALYSIS_MATH_TYPE: Readonly<Record<AnalysisTag, MathType>> = {
    anomaly: PROBABILITY,
    behavior: DYNAMICAL_SYSTEMS,
    cause: LOGIC,
    change: DYNAMICAL_SYSTEMS,
    complexity: INFORMATION_THEORY,
    fractal: TOPOLOGY,
    frequency: PROBABILITY,
    function: ANALYSIS,
    invariant: TOPOLOGY,
    meaning: LOGIC,
    optimization: OPTIMIZATION,
    prediction: PROBABILITY,
    relation: GRAPH,
    sequential: DYNAMICAL_SYSTEMS,
    space: TOPOLOGY,
    statistical: PROBABILITY,
    structure: ALGEBRA,
    time: DYNAMICAL_SYSTEMS,
    transformation: ANALYSIS,
};

export const ROUNDING = { coarse: 1, fine: 4, standard: 2 } as const;
