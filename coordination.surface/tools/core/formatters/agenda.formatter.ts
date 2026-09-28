import { SCHEDULE_DIVIDER, SCHEDULE_HEADER } from "../constants/agenda.constants.ts";
import type { SchedulePlan } from "../../../config/agenda.config.ts";
import type { ScheduleReading } from "../types/agenda.types.ts";

const CELL_BREAKS: ReadonlySet<string> = new Set(["\n", "\r", "\t", " "]);

export const oneLine = function oneLine(value: string): string {
    let out = "";
    let pending = false;

    for (const character of value) {
        if (CELL_BREAKS.has(character)) {
            pending = out.length > 0;
            continue;
        }

        if (pending) {
            out += " ";
        }
        pending = false;
        out += character;
    }

    return out;
};

const invariantCell = function invariantCell(plan: SchedulePlan): string {
    const named = `\`${plan.invariant}\``;
    return plan.merged === undefined ? named : `${named} **merged with** \`${plan.merged}\``;
};

const stateCell = function stateCell(reading: ScheduleReading): string {
    const { note } = reading.plan;
    if (note === undefined || note.length === 0) {
        return reading.state;
    }

    return `\`${reading.state}\` — ${note}`;
};

export const renderSchedule = function renderSchedule(readings: readonly ScheduleReading[]): string[] {
    return [
        SCHEDULE_HEADER,
        SCHEDULE_DIVIDER,
        ...readings.map(
            (reading) =>
                `| ${oneLine(reading.plan.ordinal)} | ${oneLine(invariantCell(reading.plan))} | ${oneLine(reading.plan.establishes)} | ${oneLine(stateCell(reading))} |`,
        ),
    ];
};
