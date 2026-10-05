import { parseLines, parseLocation } from "#core/parsers/location.parser";
import type { Finding } from "#types/finding.types";
import { advisoryFinding } from "#core/factories/finding.factory";

const TOOL = "go-critic";
const MARKER = ": ";

const parseLine = function parseLine(raw: string, ecosystem: string): Finding | null {
    const firstMarker = raw.indexOf(MARKER);
    const rest = firstMarker === -1 ? "" : raw.slice(firstMarker + MARKER.length);
    const checkIdx = rest.indexOf(MARKER);
    const location = checkIdx === -1 ? null : parseLocation(raw.slice(0, firstMarker));
    if (location === null) {
        return null;
    }
    return advisoryFinding({
        ...location,
        ecosystem,
        message: rest.slice(checkIdx + MARKER.length).trim(),
        ruleId: rest.slice(0, checkIdx),
        tool: TOOL,
    });
};

export const parseGoCriticOutput = function parseGoCriticOutput(stdout: string, ecosystem: string): Finding[] {
    return parseLines(stdout, (line) => parseLine(line, ecosystem));
};
