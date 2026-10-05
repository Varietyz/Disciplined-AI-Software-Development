import { AXIS_NAMES, unknownRung, unknownTag } from "#configuration/strings/axis.strings";
import type { Coordinate, CoordinateInput } from "#types/axis.types";
import { isAnalysisTag, isOntologyTag, isReasoningRung, isRepresentationTag } from "#core/predicates/axis.predicate";

export class CoordinateError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "CoordinateError";
    }
}

export const coordinate = function coordinate(input: CoordinateInput): Coordinate {
    const { ontology, analysis, representation, reasoning } = input;
    if (!isOntologyTag(ontology)) {
        throw new CoordinateError(unknownTag(AXIS_NAMES.ontology, ontology));
    }
    if (!isAnalysisTag(analysis)) {
        throw new CoordinateError(unknownTag(AXIS_NAMES.analysis, analysis));
    }
    if (!isRepresentationTag(representation)) {
        throw new CoordinateError(unknownTag(AXIS_NAMES.representation, representation));
    }
    if (!isReasoningRung(reasoning)) {
        throw new CoordinateError(unknownRung(reasoning));
    }
    return Object.freeze({ analysis, ontology, reasoning, representation });
};
