import { SCHEDULE_HEADER } from "../constants/agenda.constants.ts";
import type { ScheduleReading } from "../types/agenda.types.ts";
import { renderSchedule } from "../formatters/agenda.formatter.ts";
import { sameRow } from "../normalizers/document.normalizer.ts";

const ROW_MARKER = "|";

interface TableBounds {
    readonly from: number;
    readonly to: number;
}

export const scheduleBounds = function scheduleBounds(lines: readonly string[]): TableBounds | null {
    const from = lines.findIndex((line) => sameRow(line, SCHEDULE_HEADER));
    if (from === -1) {
        return null;
    }

    let to = from;
    while (to + 1 < lines.length && (lines[to + 1] ?? "").trim().startsWith(ROW_MARKER)) {
        to += 1;
    }

    return { from, to };
};

export const healSchedule = function healSchedule(source: string, rendered: readonly string[]): string | null {
    const lines = source.split("\n");
    const bounds = scheduleBounds(lines);
    if (bounds === null) {
        return null;
    }

    const held = lines.slice(bounds.from, bounds.to + 1);
    if (held.length === rendered.length && held.every((line, index) => sameRow(line, rendered[index] ?? ""))) {
        return null;
    }

    return [...lines.slice(0, bounds.from), ...rendered, ...lines.slice(bounds.to + 1)].join("\n");
};

export const driftedRows = function driftedRows(
    lines: readonly string[],
    readings: readonly ScheduleReading[],
): ScheduleReading[] {
    const bounds = scheduleBounds(lines);
    if (bounds === null) {
        return [];
    }

    const rendered = renderSchedule(readings);
    return readings.filter(
        (_reading, index) => !sameRow(lines[bounds.from + 2 + index] ?? "", rendered[index + 2] ?? ""),
    );
};
