import type { ProjectValidator } from "#types/validation.types";
import { duplicateValidator } from "#configuration/strings/validation.strings";

const VALIDATORS = new Map<string, ProjectValidator>();

export const defineValidator = function defineValidator(validator: ProjectValidator): ProjectValidator {
    if (VALIDATORS.has(validator.id)) {
        throw new Error(duplicateValidator(validator.id));
    }
    VALIDATORS.set(validator.id, validator);
    return validator;
};

export const registeredValidators = function registeredValidators(): ProjectValidator[] {
    return [...VALIDATORS.values()].toSorted((a, b) => a.id.localeCompare(b.id));
};
