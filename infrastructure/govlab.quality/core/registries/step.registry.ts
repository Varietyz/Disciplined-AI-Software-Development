import type { CatalogStep } from "#types/catalog.types";
import { duplicateStep } from "#configuration/strings/catalog.strings";

const STEPS = new Map<string, CatalogStep>();

export const defineStep = function defineStep(step: CatalogStep): CatalogStep {
    if (STEPS.has(step.name)) {
        throw new Error(duplicateStep(step.name));
    }
    STEPS.set(step.name, step);
    return step;
};

export const registeredSteps = function registeredSteps(): CatalogStep[] {
    return [...STEPS.values()].toSorted((a, b) => a.name.localeCompare(b.name));
};
