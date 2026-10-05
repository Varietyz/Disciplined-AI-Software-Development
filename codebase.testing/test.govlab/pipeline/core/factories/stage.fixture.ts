import type { Stage, StageScope, Step } from "@govlab/pipeline/types/stage.types.ts";
import { MEMBERS } from "@govlab/pipeline/configuration/configs/package.config.ts";
import { labelsOf } from "@govlab/pipeline/core/converters/stage.converter.ts";

export const scopeFor = function scopeFor(ids: readonly string[], full: boolean): StageScope {
    const scoped = MEMBERS.filter((member) => ids.includes(member.id));
    return {
        appOnly: (steps) => (ids.includes("app") ? steps : []),
        codemodScope: "",
        options: { cleanCommentsIgnore: "", hexIgnore: "", qualityRoot: "", scope: new Set(ids) },
        scoped,
        scopedDirs: scoped.map((member) => member.dir),
        testTargets: [],
        wide: (steps: Step[]) => (full ? steps : []),
    };
};

export const stepLabels = function stepLabels(stage: Stage): string[] {
    return stage.steps.flatMap(labelsOf);
};
