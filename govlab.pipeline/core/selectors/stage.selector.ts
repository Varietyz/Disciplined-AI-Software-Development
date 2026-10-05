import type { ParallelStep, Stage, StageArgs, Step } from "#types/stage.types";
import { unknownSlugs } from "#configuration/strings/stage.strings";

export const isActive = function isActive(stage: Stage, args: StageArgs): boolean {
    if (args.run.has(stage.slug)) {
        return true;
    }
    if (args.bypass.has(stage.slug)) {
        return false;
    }
    return stage.bypass !== true;
};

export const argErrorsOf = function argErrorsOf(label: string, stages: readonly Stage[], args: StageArgs): string[] {
    const known = [...new Set(stages.map((stage) => stage.slug))];
    const unknown = [...args.bypass, ...args.run].filter((slug) => !known.includes(slug));
    return unknown.length > 0 ? [unknownSlugs(label, unknown, known)] : [];
};

const tagsOf = function tagsOf(step: Step): string[] {
    return [...(step.tags ?? []), ...(step.parallel ?? []).flatMap((sub: ParallelStep) => sub.tags ?? [])];
};

const hits = function hits(label: string, needles: ReadonlySet<string>): boolean {
    const lower = label.toLowerCase();
    return [...needles].some((needle) => lower.includes(needle.toLowerCase()));
};

const matchesOnly = function matchesOnly(step: Step, only: ReadonlySet<string>): boolean {
    if (only.size === 0) {
        return true;
    }
    const labels = [step.label ?? "", ...(step.parallel ?? []).map((sub: ParallelStep) => sub.label)];
    return labels.some((label) => hits(label, only));
};

const matchesTags = function matchesTags(step: Step, args: StageArgs): boolean {
    const tags = tagsOf(step);
    if (args.tags.size > 0 && !tags.some((tag) => args.tags.has(tag))) {
        return false;
    }
    return !tags.some((tag) => args.skipTags.has(tag));
};

const narrowParallel = function narrowParallel(step: Step, args: StageArgs): Step {
    if (step.parallel === undefined || args.only.size === 0) {
        return step;
    }
    const parallel = step.parallel.filter((sub: ParallelStep) => hits(sub.label, args.only));
    return parallel.length === 0 ? step : { ...step, parallel };
};

export const selectSteps = function selectSteps(stage: Stage, args: StageArgs): Stage {
    const steps = stage.steps
        .filter((step) => matchesOnly(step, args.only) && matchesTags(step, args))
        .map((step) => narrowParallel(step, args));
    return { ...stage, steps };
};
