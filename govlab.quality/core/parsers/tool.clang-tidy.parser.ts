import { parseLines, parseLocation } from "#core/parsers/location.parser";
import type { Finding } from "#types/finding.types";
import { advisoryFinding } from "#core/factories/finding.factory";

const TOOL = "clang-tidy";
const DIAGNOSTIC_MARKERS = [": error: ", ": warning: "];

const findMarker = function findMarker(raw: string): { idx: number; marker: string } | null {
    const found = DIAGNOSTIC_MARKERS.map((marker) => ({ idx: raw.indexOf(marker), marker }))
        .filter((entry) => entry.idx !== -1)
        .toSorted((a, b) => a.idx - b.idx);
    return found[0] ?? null;
};

const extractCheck = function extractCheck(rest: string): { message: string; ruleId: string } {
    const open = rest.lastIndexOf("[");
    const close = rest.lastIndexOf("]");
    const ruleId = open !== -1 && close > open ? rest.slice(open + 1, close) : TOOL;
    const message = (open === -1 ? rest : rest.slice(0, open)).trim();
    return { message, ruleId };
};

const parseLine = function parseLine(raw: string, ecosystem: string): Finding | null {
    const found = findMarker(raw);
    const location = found === null ? null : parseLocation(raw.slice(0, found.idx));
    if (found === null || location === null) {
        return null;
    }
    const { message, ruleId } = extractCheck(raw.slice(found.idx + found.marker.length));
    return advisoryFinding({ ...location, ecosystem, message, ruleId, tool: TOOL });
};

export const parseClangTidyOutput = function parseClangTidyOutput(stdout: string, ecosystem: string): Finding[] {
    return parseLines(stdout, (line) => parseLine(line, ecosystem));
};
