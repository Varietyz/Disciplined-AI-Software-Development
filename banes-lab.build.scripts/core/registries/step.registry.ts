import type { SiteStep } from "#types/site.types";
import { duplicateStep } from "#configuration/strings/site.strings";

const steps = new Map<string, SiteStep>();

export const registerStep = function registerStep(step: SiteStep): void {
    if (steps.has(step.name)) {
        throw new Error(duplicateStep(step.name));
    }
    steps.set(step.name, step);
};

export const registeredSteps = function registeredSteps(): readonly SiteStep[] {
    return [...steps.values()];
};
