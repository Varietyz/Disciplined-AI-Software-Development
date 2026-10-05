import { numberField, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { advisoryFinding } from "#core/factories/finding.factory";
import { jsonRecordsAt } from "#core/parsers/record.parser";

const TOOL = "brakeman";

export const parseBrakemanOutput = function parseBrakemanOutput(stdout: string, ecosystem: string): Finding[] {
    return jsonRecordsAt(stdout || "{}", "warnings").map((warning) =>
        advisoryFinding({
            column: POSITION,
            ecosystem,
            file: stringField(warning, "file"),
            line: numberField(warning, "line", POSITION),
            message: stringField(warning, "message") || stringField(warning, "warning_type"),
            ruleId: stringField(warning, "check_name", TOOL),
            tool: TOOL,
        }),
    );
};
