export const SCHEDULE_STATES = ["planned", "created", "open", "archived"] as const;

export type ScheduleState = (typeof SCHEDULE_STATES)[number];

export interface SchedulePlan {
    readonly ordinal: string;
    readonly invariant: string;
    readonly merged?: string;
    readonly establishes: string;
    readonly note?: string;
    readonly declaredState?: ScheduleState;
    readonly declaredBecause?: string;
}

export function defineSchedule(rows: readonly SchedulePlan[]): readonly SchedulePlan[] {
    return rows;
}

export const schedule: readonly SchedulePlan[] = defineSchedule([]);
