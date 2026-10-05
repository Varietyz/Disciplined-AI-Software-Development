import type { Finding, SourceLocation } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { parseLines } from "#core/parsers/location.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "yamllint";
const MARKER = ": [";

const extractRule = function extractRule(body: string): { message: string; ruleId: string } {
    const open = body.endsWith(")") ? body.lastIndexOf("(") : -1;
    return open === -1
        ? { message: body, ruleId: TOOL }
        : { message: body.slice(0, open).trim(), ruleId: body.slice(open + 1, -1) };
};

const locationOf = function locationOf(location: string): SourceLocation {
    const lastColon = location.lastIndexOf(":");
    const beforeCol = location.slice(0, lastColon);
    const lineColon = beforeCol.lastIndexOf(":");
    return {
        column: Number(location.slice(lastColon + 1)) || POSITION,
        file: beforeCol.slice(0, lineColon),
        line: Number(beforeCol.slice(lineColon + 1)) || POSITION,
    };
};

const parseLine = function parseLine(line: string, ecosystem: string): Finding | null {
    const marker = line.indexOf(MARKER);
    if (marker === -1) {
        return null;
    }
    const rest = line.slice(marker + MARKER.length);
    const { message, ruleId } = extractRule(rest.slice(rest.indexOf("]") + 1).trim());
    return toolFinding({ ...locationOf(line.slice(0, marker)), ecosystem, message, ruleId, tool: TOOL });
};

export const parseYamllintOutput = function parseYamllintOutput(output: string, ecosystem: string): Finding[] {
    return parseLines(output, (line) => parseLine(line, ecosystem));
};
