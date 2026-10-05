import type { Coordinate } from "#types/axis.types";
import type { Significance } from "#types/baseline.types";

export interface Narrative {
    observation: string;
    explanation: string;
}

export interface FindingSignificance extends Significance {
    nullModel: string;
}

export interface Prediction {
    method: string;
    accuracy: number;
}

export interface Finding {
    field: string;
    name: string;
    coordinate: Coordinate;
    observation: Readonly<Record<string, unknown>>;
    narrative: Narrative;
    support: number;
    mathType: string;
    significance?: FindingSignificance;
    prediction?: Prediction;
}

export interface FindingInput {
    field: string;
    name: string;
    coordinate: Coordinate;
    observation: Readonly<Record<string, unknown>>;
    narrative: Narrative;
    significance?: FindingSignificance;
    prediction?: Prediction;
}

export interface ExplanationSpec {
    field: string;
    name: string;
    ontology: string;
    analysis: string;
    representation: string;
    observation: Readonly<Record<string, unknown>>;
    observed: string;
    explained: string;
}
