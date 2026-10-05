import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { advisoryFinding } from "#core/factories/finding.factory";
import { parseLines } from "#core/parsers/location.parser";
import { unimportedExport } from "#configuration/strings/tool.strings";

const TOOL = "ts-prune";
const USED_IN_MODULE = "(used in module)";
const SEPARATOR = " - ";

const parseLine = function parseLine(raw: string, ecosystem: string): Finding | null {
    const sep = raw.endsWith(USED_IN_MODULE) ? -1 : raw.indexOf(SEPARATOR);
    const location = sep === -1 ? "" : raw.slice(0, sep);
    const colon = location.lastIndexOf(":");
    const line = colon === -1 ? Number.NaN : Number(location.slice(colon + 1));
    if (!Number.isInteger(line)) {
        return null;
    }
    return advisoryFinding({
        column: POSITION,
        ecosystem,
        file: location.slice(0, colon),
        line,
        message: unimportedExport(raw.slice(sep + SEPARATOR.length).trim()),
        ruleId: "unused-export",
        tool: TOOL,
    });
};

export const parseTsPruneOutput = function parseTsPruneOutput(stdout: string, ecosystem: string): Finding[] {
    return parseLines(stdout, (line) => parseLine(line, ecosystem));
};
