import { numberField, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { advisoryFinding } from "#core/factories/finding.factory";
import { jsonRecordsAt } from "#core/parsers/record.parser";

const TOOL = "credo";

export const parseCredoOutput = function parseCredoOutput(stdout: string, ecosystem: string): Finding[] {
    const start = stdout.indexOf("{");
    const end = stdout.lastIndexOf("}");
    if (start === -1 || end < start) {
        return [];
    }
    return jsonRecordsAt(stdout.slice(start, end + 1), "issues").map((issue) =>
        advisoryFinding({
            column: numberField(issue, "column", POSITION),
            ecosystem,
            file: stringField(issue, "filename"),
            line: numberField(issue, "line_no", POSITION),
            message: stringField(issue, "message").trim(),
            ruleId: stringField(issue, "check", TOOL),
            tool: TOOL,
        }),
    );
};
