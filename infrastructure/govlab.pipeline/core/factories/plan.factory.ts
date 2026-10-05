import { APP_ID, TSCONFIG } from "#configuration/constants/stage.constants";
import type { Member, Stage, StageOptions, StagePlan, StageScope, Step } from "#types/stage.types";
import {
    autoFixStage,
    formatStage,
    lintingStage,
    prepareStage,
    testingStage,
    unusedStage,
} from "#core/factories/stage.factory";
import { MEMBERS } from "#configuration/configs/package.config";
import { buildStage } from "#core/factories/build.factory";
import { labelsOf } from "#core/converters/stage.converter";
import { validationStage } from "#core/factories/validation.factory";

const STAGES: readonly ((scope: StageScope) => Stage)[] = [
    prepareStage,
    unusedStage,
    autoFixStage,
    formatStage,
    lintingStage,
    testingStage,
    buildStage,
    validationStage,
];

const isDir = function isDir(value: string | null): value is string {
    return typeof value === "string";
};

const scopeOf = function scopeOf(
    scoped: readonly Member[],
    options: StageOptions,
    wide: StageScope["wide"],
): StageScope {
    const scopedDirs = scoped.map((member) => member.dir);
    const hasApp = scoped.some((member) => member.id === APP_ID);
    const tsconfigs = scopedDirs.map((dir) => `${dir}/${TSCONFIG}`).join(",");
    return {
        appOnly: (steps) => (hasApp ? steps : []),
        codemodScope: ` --tsconfig ${tsconfigs}`,
        options,
        scoped,
        scopedDirs,
        testTargets: scoped.map((member) => member.tests).filter(isDir),
        wide,
    };
};

export const stagesFor = function stagesFor(options: StageOptions): StagePlan {
    const full = options.scope.size === 0;
    const scoped = MEMBERS.filter((member) => (full ? member.gated : options.scope.has(member.id)));
    const skippedWide: string[] = [];
    const wide = function wide(steps: Step[]): Step[] {
        if (full) {
            return steps;
        }
        skippedWide.push(...steps.flatMap(labelsOf));
        return [];
    };
    const scope = scopeOf(scoped, options, wide);
    const stages = STAGES.map((build) => build(scope)).filter((stage) => stage.steps.length > 0);
    return { skippedWide, stages };
};
