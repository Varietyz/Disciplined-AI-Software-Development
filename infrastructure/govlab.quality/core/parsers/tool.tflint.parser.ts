import { boolField, numberField, recordAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { jsonRecordsAt } from "#core/parsers/record.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "tflint";
const MESSAGE_SEPARATOR = "; ";

export const tflintErrorDetail = function tflintErrorDetail(stdout: string, stderr: string): string {
    const joined = jsonRecordsAt(stdout || "{}", "errors")
        .map((error) => stringField(error, "message"))
        .filter((message) => message.length > 0)
        .join(MESSAGE_SEPARATOR);
    return joined.length > 0 ? joined : stderr.trim() || stdout.trim();
};

export const parseTflintOutput = function parseTflintOutput(stdout: string, ecosystem: string): Finding[] {
    return jsonRecordsAt(stdout || "{}", "issues").map((issue) => {
        const range = recordAt(issue, "range");
        const start = recordAt(range, "start");
        return toolFinding({
            advisory: true,
            column: numberField(start, "column", POSITION),
            ecosystem,
            file: stringField(range, "filename"),
            fixable: boolField(issue, "fixable"),
            line: numberField(start, "line", POSITION),
            message: stringField(issue, "message"),
            ruleId: stringField(recordAt(issue, "rule"), "name", TOOL),
            tool: TOOL,
        });
    });
};
