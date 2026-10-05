import type { PatternVocabulary } from "#types/concept.types";
import type { ReasonOntology } from "#types/reason.types";
import { undeclaredModel } from "#configuration/strings/reason.strings";

const REASONING_MODEL = "epistemology";

const idsOf = function idsOf(records: readonly { id: string }[]): string[] {
    return records.map((record) => record.id);
};

export const patternVocabularyOf = function patternVocabularyOf(reason: ReasonOntology): PatternVocabulary {
    const model = reason.models().find((entry) => entry.id === REASONING_MODEL);
    if (model === undefined) {
        throw new Error(undeclaredModel(REASONING_MODEL));
    }
    return {
        analysis: idsOf(reason.lenses()),
        mathTypes: idsOf(reason.mathTypes()),
        ontology: idsOf(reason.dimensions()),
        reasoning: [...model.sequence],
        representation: idsOf(reason.representations()),
    };
};
