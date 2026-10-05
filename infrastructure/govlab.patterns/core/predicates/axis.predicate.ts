import {
    ANALYSIS_AXIS,
    ONTOLOGY_AXIS,
    REASONING_AXIS,
    REPRESENTATION_AXIS,
} from "#configuration/generated/axis.generated";
import type { AnalysisTag, OntologyTag, ReasoningRung, RepresentationTag } from "#types/axis.types";

const ONTOLOGY_SET: ReadonlySet<string> = new Set(ONTOLOGY_AXIS);
const ANALYSIS_SET: ReadonlySet<string> = new Set(ANALYSIS_AXIS);
const REPRESENTATION_SET: ReadonlySet<string> = new Set(REPRESENTATION_AXIS);
const REASONING_SET: ReadonlySet<string> = new Set(REASONING_AXIS);

export const isOntologyTag = function isOntologyTag(value: string): value is OntologyTag {
    return ONTOLOGY_SET.has(value);
};

export const isAnalysisTag = function isAnalysisTag(value: string): value is AnalysisTag {
    return ANALYSIS_SET.has(value);
};

export const isRepresentationTag = function isRepresentationTag(value: string): value is RepresentationTag {
    return REPRESENTATION_SET.has(value);
};

export const isReasoningRung = function isReasoningRung(value: string): value is ReasoningRung {
    return REASONING_SET.has(value);
};
