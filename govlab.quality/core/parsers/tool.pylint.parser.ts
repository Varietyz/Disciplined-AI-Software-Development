import { COLUMN_BASE, POSITION } from "#configuration/constants/tool.constants";
import { numberField, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { parseJsonRecords } from "#core/parsers/record.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "pylint";

export const parsePylintOutput = function parsePylintOutput(
    stdout: string,
    ecosystem: string,
    advisory: boolean,
): Finding[] {
    return parseJsonRecords(stdout || "[]").map((message) =>
        toolFinding({
            advisory,
            column: numberField(message, "column", 0) + COLUMN_BASE,
            ecosystem,
            file: stringField(message, "path"),
            line: numberField(message, "line", POSITION),
            message: stringField(message, "message"),
            ruleId: stringField(message, "symbol") || stringField(message, "message-id") || TOOL,
            tool: TOOL,
        }),
    );
};
