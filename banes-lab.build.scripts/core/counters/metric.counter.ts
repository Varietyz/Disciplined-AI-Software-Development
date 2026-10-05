import { LOCAL_RULES, PLUGIN_MODULES } from "@ssot/govlab/shared/generated/rule-index.generated.ts";
import type { CategoryGroup } from "#types/metric.types";
import type { Stage } from "@govlab/pipeline/types/stage.types.ts";
import { stagesFor } from "@govlab/pipeline/core/factories/plan.factory.ts";

const EMPTY_OPTION = "";

export const countedRules = function countedRules(): number {
    return Object.keys(LOCAL_RULES).length + PLUGIN_MODULES.length;
};

export const countedSteps = function countedSteps(stages: readonly Stage[]): number {
    return stages.reduce(
        (total, stage) => total + stage.steps.reduce((held, step) => held + (step.parallel?.length ?? 1), 0),
        0,
    );
};

export const gateSteps = function gateSteps(): number {
    return countedSteps(
        stagesFor({
            cleanCommentsIgnore: EMPTY_OPTION,
            hexIgnore: EMPTY_OPTION,
            qualityRoot: EMPTY_OPTION,
            scope: new Set<string>(),
        }).stages,
    );
};

export const countedGroups = function countedGroups(
    groups: readonly CategoryGroup[],
    pick: (group: CategoryGroup) => readonly unknown[] | undefined,
): number {
    return groups.reduce((total, group) => total + (pick(group)?.length ?? 0), 0);
};
