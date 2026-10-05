import {
    CODE_FENCE,
    RECORD_CLOSE,
    RECORD_OPEN,
    ROSTER_LINES,
    SECTION_BANNER,
} from "#configuration/constants/surface.constants";
import type { FigureFrame, Region, ScenarioTool } from "#types/surface.types";
import type { SurfaceFigureName, SurfaceLine, SurfaceRecording } from "@banes-lab/web/types/surface.types.ts";

const QUOTE = '"';

const SPACE = " ";

export const changedRegion = function changedRegion(
    before: readonly string[],
    after: readonly string[],
): Region | null {
    const shorter = Math.min(before.length, after.length);
    let prefix = 0;
    while (prefix < shorter && before[prefix] === after[prefix]) {
        prefix += 1;
    }
    let suffix = 0;
    while (suffix < shorter - prefix && before[before.length - 1 - suffix] === after[after.length - 1 - suffix]) {
        suffix += 1;
    }
    const to = after.length - suffix;
    return prefix === after.length && before.length === after.length
        ? null
        : { from: prefix, to: Math.max(prefix, to) };
};

interface ViewPlace {
    readonly fenced: boolean;
    readonly inRecord: boolean;
    readonly inTail: boolean;
    readonly afterKept: boolean;
}

const isViewLine = function isViewLine(line: string, place: ViewPlace): boolean {
    if (place.inTail || place.inRecord) {
        return true;
    }
    if (line === "") {
        return place.afterKept;
    }
    return !place.fenced && ROSTER_LINES.some((roster) => line.startsWith(roster));
};

export const venueView = function venueView(lines: readonly string[]): string[] {
    const tail = lines.findLastIndex((line) => line.startsWith(SECTION_BANNER));
    const kept: string[] = [];
    let fenced = false;
    let inRecord = false;
    let afterKept = false;
    for (const [index, line] of lines.entries()) {
        fenced = fenced !== line.startsWith(CODE_FENCE);
        inRecord ||= !fenced && line.startsWith(RECORD_OPEN);
        afterKept = isViewLine(line, { afterKept, fenced, inRecord, inTail: tail !== -1 && index >= tail });
        if (afterKept) {
            kept.push(line);
        }
        inRecord &&= !line.startsWith(RECORD_CLOSE);
    }
    return kept;
};

export const markedLines = function markedLines(lines: readonly string[], highlight: Region | null): SurfaceLine[] {
    return lines.map((text, at) => ({
        changed: highlight !== null && at >= highlight.from && at < highlight.to,
        text,
    }));
};

const quoted = function quoted(argument: string): string {
    return argument.includes(SPACE) ? QUOTE + argument + QUOTE : argument;
};

export const commandLine = function commandLine(tool: ScenarioTool, args: readonly string[]): string {
    return `npm run ${tool} -- ${args.map(quoted).join(SPACE)}`;
};

export const appendLine = function appendLine(text: string, file: string): string {
    return `echo ${QUOTE}${text}${QUOTE} >> ${file}`;
};

export const recordingsOf = function recordingsOf(
    frames: readonly FigureFrame[],
    inputs: string,
): Map<SurfaceFigureName, SurfaceRecording> {
    const grouped = Map.groupBy(frames, (entry) => entry.figure);
    return new Map(
        [...grouped].map(([figure, entries]) => [
            figure,
            { figure, frames: entries.map((entry) => entry.frame), inputs, opening: entries.at(0)?.before ?? [] },
        ]),
    );
};
