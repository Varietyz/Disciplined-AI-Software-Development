import { numberField, recordAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { advisoryFinding } from "#core/factories/finding.factory";
import { jsonRecordsAt } from "#core/parsers/record.parser";

const TOOL = "semgrep";

export const parseSemgrepOutput = function parseSemgrepOutput(stdout: string, ecosystem: string): Finding[] {
    return jsonRecordsAt(stdout || "{}", "results").map((result) => {
        const start = recordAt(result, "start");
        return advisoryFinding({
            column: numberField(start, "col", POSITION),
            ecosystem,
            file: stringField(result, "path"),
            line: numberField(start, "line", POSITION),
            message: stringField(recordAt(result, "extra"), "message").trim(),
            ruleId: stringField(result, "check_id", TOOL),
            tool: TOOL,
        });
    });
};
