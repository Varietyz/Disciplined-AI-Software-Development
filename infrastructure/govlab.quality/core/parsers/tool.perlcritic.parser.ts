import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "perlcritic";
const FIELD_COUNT = 6;
const LINE_IDX = 1;
const COLUMN_IDX = 2;
const RULE_IDX = 4;
const MESSAGE_IDX = 5;

export const PERLCRITIC_DELIMITER = "~|~";

export const parsePerlcriticOutput = function parsePerlcriticOutput(stdout: string, ecosystem: string): Finding[] {
    return stdout
        .split("\n")
        .map((line) => line.split(PERLCRITIC_DELIMITER))
        .filter((parts) => parts.length >= FIELD_COUNT)
        .map((parts) =>
            toolFinding({
                column: Number(parts[COLUMN_IDX]) || POSITION,
                ecosystem,
                file: parts[0] ?? "",
                line: Number(parts[LINE_IDX]) || POSITION,
                message: parts.slice(MESSAGE_IDX).join(PERLCRITIC_DELIMITER).trim(),
                ruleId: parts[RULE_IDX] ?? TOOL,
                tool: TOOL,
            }),
        );
};
