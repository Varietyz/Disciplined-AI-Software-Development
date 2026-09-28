import type { SchedulePlan, ScheduleState } from "../../../config/agenda.config.ts";

export interface ScheduleReading {
    readonly plan: SchedulePlan;
    readonly state: ScheduleState;
    readonly derived: boolean;
    readonly evidence: string;
}
