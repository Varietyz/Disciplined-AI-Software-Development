import { concernsShape, unknownConcept } from "#configuration/strings/quality.strings";
import type { ConcernConfig } from "#types/concern.types";
import { isRecord } from "#core/selectors/record.selector";
import { validConcepts } from "#core/selectors/concept.selector";

const isConcernConfig = function isConcernConfig(value: unknown): value is ConcernConfig {
    return isRecord(value);
};

export const validateConcerns = function validateConcerns(
    concerns: unknown,
    valid: ReadonlySet<string> = validConcepts(),
): ConcernConfig {
    if (!isConcernConfig(concerns)) {
        throw new Error(concernsShape(Array.isArray(concerns) ? "array" : typeof concerns));
    }
    if (valid.size === 0) {
        return concerns;
    }
    const unknown = Object.keys(concerns).find((key) => !valid.has(key));
    if (unknown !== undefined) {
        throw new Error(unknownConcept(unknown, valid.size));
    }
    return concerns;
};
