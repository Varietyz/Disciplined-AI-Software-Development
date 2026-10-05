import type {
    ANALYSIS_AXIS,
    MATH_TYPE_AXIS,
    ONTOLOGY_AXIS,
    REASONING_AXIS,
    REPRESENTATION_AXIS,
} from "#configuration/generated/axis.generated";

export type OntologyTag = (typeof ONTOLOGY_AXIS)[number];

export type AnalysisTag = (typeof ANALYSIS_AXIS)[number];

export type RepresentationTag = (typeof REPRESENTATION_AXIS)[number];

export type ReasoningRung = (typeof REASONING_AXIS)[number];

export type MathType = (typeof MATH_TYPE_AXIS)[number];

export interface Coordinate {
    ontology: OntologyTag;
    analysis: AnalysisTag;
    representation: RepresentationTag;
    reasoning: ReasoningRung;
}

export interface CoordinateInput {
    ontology: string;
    analysis: string;
    representation: string;
    reasoning: string;
}
