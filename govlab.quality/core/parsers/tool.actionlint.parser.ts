import { numberField, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { advisoryFinding } from "#core/factories/finding.factory";
import { parseJsonRecords } from "#core/parsers/record.parser";

const TOOL = "actionlint";

export const parseActionlintOutput = function parseActionlintOutput(stdout: string, ecosystem: string): Finding[] {
    return parseJsonRecords(stdout || "[]").map((error) =>
        advisoryFinding({
            column: numberField(error, "column", POSITION),
            ecosystem,
            file: stringField(error, "filepath"),
            line: numberField(error, "line", POSITION),
            message: stringField(error, "message"),
            ruleId: stringField(error, "kind", TOOL),
            tool: TOOL,
        }),
    );
};
