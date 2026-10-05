import type { ExplanationSpec, Finding, FindingInput, Narrative } from "#types/finding.types";
import { coordinate } from "#core/factories/axis.factory";
import { mathTypeOf } from "#core/resolvers/math.resolver";

const EXPLANATION = "explanation";

export const reasonOf = function reasonOf(observation: string, explanation: string): Narrative {
    return { explanation, observation };
};

export const makeFinding = function makeFinding(input: FindingInput): Finding {
    const base: Finding = {
        coordinate: input.coordinate,
        field: input.field,
        mathType: mathTypeOf(input.coordinate.analysis),
        name: input.name,
        narrative: input.narrative,
        observation: input.observation,
        support: 0,
    };
    const withSignificance = input.significance === undefined ? base : { ...base, significance: input.significance };
    return input.prediction ? { ...withSignificance, prediction: input.prediction } : withSignificance;
};

export const explanationFinding = function explanationFinding(spec: ExplanationSpec): Finding {
    return makeFinding({
        coordinate: coordinate({
            analysis: spec.analysis,
            ontology: spec.ontology,
            reasoning: EXPLANATION,
            representation: spec.representation,
        }),
        field: spec.field,
        name: spec.name,
        narrative: reasonOf(spec.observed, spec.explained),
        observation: spec.observation,
    });
};
