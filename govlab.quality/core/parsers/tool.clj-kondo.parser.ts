import { numberField, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { jsonRecordsAt } from "#core/parsers/record.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "clj-kondo";

export const parseCljKondoOutput = function parseCljKondoOutput(stdout: string, ecosystem: string): Finding[] {
    return jsonRecordsAt(stdout || "{}", "findings").map((finding) =>
        toolFinding({
            column: numberField(finding, "col", POSITION),
            ecosystem,
            file: stringField(finding, "filename"),
            line: numberField(finding, "row", POSITION),
            message: stringField(finding, "message"),
            ruleId: stringField(finding, "type", TOOL),
            tool: TOOL,
        }),
    );
};
