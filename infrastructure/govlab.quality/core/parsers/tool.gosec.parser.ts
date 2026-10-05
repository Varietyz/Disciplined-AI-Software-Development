import { numericField, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { advisoryFinding } from "#core/factories/finding.factory";
import { jsonRecordsAt } from "#core/parsers/record.parser";

const TOOL = "gosec";

export const parseGosecOutput = function parseGosecOutput(stdout: string, ecosystem: string): Finding[] {
    return jsonRecordsAt(stdout || "{}", "Issues").map((issue) =>
        advisoryFinding({
            column: numericField(issue, "column", POSITION),
            ecosystem,
            file: stringField(issue, "file"),
            line: numericField(issue, "line", POSITION),
            message: stringField(issue, "details"),
            ruleId: stringField(issue, "rule_id", TOOL),
            tool: TOOL,
        }),
    );
};
