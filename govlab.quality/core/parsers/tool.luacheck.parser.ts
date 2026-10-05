import { parseLines, parseLocation } from "#core/parsers/location.parser";
import type { Finding } from "#types/finding.types";
import { advisoryFinding } from "#core/factories/finding.factory";

const TOOL = "luacheck";
const LOCATION_MARKER = ": (";

const parseLine = function parseLine(raw: string, ecosystem: string): Finding | null {
    const marker = raw.indexOf(LOCATION_MARKER);
    const rest = marker === -1 ? "" : raw.slice(marker + LOCATION_MARKER.length);
    const close = rest.indexOf(")");
    const location = close === -1 ? null : parseLocation(raw.slice(0, marker));
    if (location === null) {
        return null;
    }
    return advisoryFinding({
        ...location,
        ecosystem,
        message: rest.slice(close + 1).trim(),
        ruleId: rest.slice(0, close),
        tool: TOOL,
    });
};

export const parseLuacheckOutput = function parseLuacheckOutput(stdout: string, ecosystem: string): Finding[] {
    return parseLines(stdout, (line) => parseLine(line, ecosystem));
};
