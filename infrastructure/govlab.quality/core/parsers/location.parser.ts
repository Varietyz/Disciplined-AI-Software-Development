import { LOCATION_SEGMENTS } from "#configuration/constants/tool.constants";
import type { SourceLocation } from "#types/finding.types";

export const parseLocation = function parseLocation(location: string): SourceLocation | null {
    const segments = location.split(":");
    if (segments.length < LOCATION_SEGMENTS + 1) {
        return null;
    }
    const column = Number(segments.at(-1));
    const line = Number(segments[segments.length - LOCATION_SEGMENTS]);
    if (!Number.isInteger(line) || !Number.isInteger(column)) {
        return null;
    }
    return { column, file: segments.slice(0, segments.length - LOCATION_SEGMENTS).join(":"), line };
};

export const parseLines = function parseLines<T>(text: string, parseLine: (line: string) => T | null): T[] {
    return text
        .split("\n")
        .map((line) => parseLine(line.trim()))
        .filter((entry): entry is T => entry !== null);
};
