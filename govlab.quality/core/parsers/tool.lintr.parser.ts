import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { advisoryFinding } from "#core/factories/finding.factory";
import { parseLines } from "#core/parsers/location.parser";

const TOOL = "lintr";
const FIELD_COUNT = 6;
const LINE_IDX = 1;
const COLUMN_IDX = 2;
const LINTER_IDX = 4;
const MESSAGE_IDX = 5;

export const LINTR_DELIMITER = "~|~";

const parseRecord = function parseRecord(line: string, ecosystem: string): Finding | null {
    const parts = line.split(LINTR_DELIMITER);
    if (parts.length < FIELD_COUNT) {
        return null;
    }
    return advisoryFinding({
        column: Number(parts[COLUMN_IDX]) || POSITION,
        ecosystem,
        file: parts[0] ?? "",
        line: Number(parts[LINE_IDX]) || POSITION,
        message: parts.slice(MESSAGE_IDX).join(LINTR_DELIMITER).trim(),
        ruleId: parts[LINTER_IDX] ?? "",
        tool: TOOL,
    });
};

export const parseLintrOutput = function parseLintrOutput(stdout: string, ecosystem: string): Finding[] {
    return parseLines(stdout, (line) => parseRecord(line, ecosystem));
};
