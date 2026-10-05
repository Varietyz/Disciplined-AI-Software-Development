import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { UNFORMATTED_FILE } from "#configuration/strings/tool.strings";
import { parseLines } from "#core/parsers/location.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "stylua";
const DIFF_PREFIX = "Diff in ";
const RULE_ID = "stylua/format";

export const parseStyluaCheck = function parseStyluaCheck(stdout: string): string[] {
    return parseLines(stdout, (line) => {
        if (!line.startsWith(DIFF_PREFIX)) {
            return null;
        }
        const rest = line.slice(DIFF_PREFIX.length);
        return rest.endsWith(":") ? rest.slice(0, -1) : rest;
    });
};

export const unformattedFinding = function unformattedFinding(file: string, ecosystem: string): Finding {
    return toolFinding({
        column: POSITION,
        ecosystem,
        file,
        fixable: true,
        line: POSITION,
        message: UNFORMATTED_FILE,
        ruleId: RULE_ID,
        tool: TOOL,
    });
};
