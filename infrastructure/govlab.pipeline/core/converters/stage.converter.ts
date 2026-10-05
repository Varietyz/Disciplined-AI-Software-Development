import type { PlannedStep, Stage, StagePlan, Step, Unit } from "#types/stage.types";

export const stepCount = function stepCount(step: Step): number {
    return step.parallel ? step.parallel.length : 1;
};

export const labelsOf = function labelsOf(step: Step): string[] {
    return step.parallel ? step.parallel.map((sub) => sub.label) : [step.label ?? ""];
};

export const planUnits = function planUnits(active: readonly Stage[]): Unit[] {
    const flat: PlannedStep[] = active.flatMap((stage) =>
        stage.steps.map((step, stepIndex) => ({ firstInStage: stepIndex === 0, stage, step })),
    );
    return flat.reduce<{ units: Unit[]; cursor: number }>(
        (acc, entry) => {
            const to = acc.cursor + stepCount(entry.step);
            return { cursor: to, units: [...acc.units, { ...entry, from: acc.cursor + 1, to }] };
        },
        { cursor: 0, units: [] },
    ).units;
};

export const stageLabels = function stageLabels(plan: StagePlan): string[] {
    return plan.stages.flatMap((stage) => [
        stage.label,
        stage.slug,
        ...stage.steps.flatMap(labelsOf).filter((label) => label.length > 0),
    ]);
};
