import { COLUMN_BASE, POSITION } from "#configuration/constants/tool.constants";
import { numberField, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { advisoryFinding } from "#core/factories/finding.factory";
import { jsonRecordsAt } from "#core/parsers/record.parser";

const TOOL = "bandit";

export const parseBanditOutput = function parseBanditOutput(stdout: string, ecosystem: string): Finding[] {
    return jsonRecordsAt(stdout || "{}", "results").map((result) =>
        advisoryFinding({
            column: numberField(result, "col_offset", 0) + COLUMN_BASE,
            ecosystem,
            file: stringField(result, "filename"),
            line: numberField(result, "line_number", POSITION),
            message: stringField(result, "issue_text"),
            ruleId: stringField(result, "test_id", TOOL),
            tool: TOOL,
        }),
    );
};
