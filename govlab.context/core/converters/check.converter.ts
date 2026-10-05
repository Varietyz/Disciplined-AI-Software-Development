import { CHECK_QUESTIONS, EVIDENCE_SIGNS, SIGN_SEPARATOR } from "#configuration/constants/check.constants";
import { asString, asStringArray } from "#core/normalizers/field.normalizer";
import type { CheckFacet } from "#types/check.types";
import { isObject } from "#core/predicates/record.predicate";

const SIGNS: ReadonlySet<string> = new Set(EVIDENCE_SIGNS);

export const evidenceSignOf = function evidenceSignOf(text: string): string | null {
    const separator = text.indexOf(SIGN_SEPARATOR);
    if (separator === -1 || text.slice(separator + 1).trim().length === 0) {
        return null;
    }
    const sign = text.slice(0, separator).trim();
    return SIGNS.has(sign) ? sign : null;
};

export const asCheck = function asCheck(value: unknown): CheckFacet | null {
    if (!isObject(value)) {
        return null;
    }
    const facet: CheckFacet = {};
    const by = asStringArray(value["by"]);
    if (by.length > 0) {
        facet.by = by;
    }
    for (const question of CHECK_QUESTIONS) {
        const answer = asString(value[question]);
        if (answer.length > 0) {
            facet[question] = answer;
        }
    }
    return facet;
};

export const mergeCheck = function mergeCheck(declared: CheckFacet | null, own: CheckFacet | null): CheckFacet | null {
    if (declared === null) {
        return own;
    }
    return own === null ? declared : { ...declared, ...own };
};
