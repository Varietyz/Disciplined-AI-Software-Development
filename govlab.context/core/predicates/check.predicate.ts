import type { CheckFacet, CheckQuestion } from "#types/check.types";
import { EVIDENCE_QUESTION } from "#configuration/constants/check.constants";
import { NONE_PREFIX } from "#configuration/constants/field.constants";
import { evidenceSignOf } from "#core/converters/check.converter";
import { lacksValue } from "#core/predicates/field.predicate";

export const answered = function answered(facet: CheckFacet | null, question: CheckQuestion): boolean {
    const answer = facet?.[question];
    if (typeof answer !== "string" || lacksValue(answer)) {
        return false;
    }
    return question !== EVIDENCE_QUESTION || evidenceSignOf(answer) !== null;
};

export const isDeclaredAbsent = function isDeclaredAbsent(facet: CheckFacet | null, question: CheckQuestion): boolean {
    return facet?.[question]?.startsWith(NONE_PREFIX) ?? false;
};
