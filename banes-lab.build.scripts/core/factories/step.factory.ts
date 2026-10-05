import type { SiteMode, SiteStep, StepSpec } from "#types/site.types";
import { registerStep } from "#core/registries/step.registry";

const EVERY_MODE: readonly SiteMode[] = ["build", "serve"];

export const defineStep = function defineStep(spec: StepSpec): SiteStep {
    const step: SiteStep = {
        cache: spec.cache,
        gives: spec.gives ?? [spec.name],
        modes: spec.modes ?? EVERY_MODE,
        name: spec.name,
        needs: spec.needs ?? [],
        phase: spec.phase,
        run: spec.run,
    };
    registerStep(step);
    return step;
};
