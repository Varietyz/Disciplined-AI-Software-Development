import { numberField, recordAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { jsonRecordsAt } from "#core/parsers/record.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "golangci-lint";

export const parseGolangciOutput = function parseGolangciOutput(report: string, ecosystem: string): Finding[] {
    return jsonRecordsAt(report || "{}", "Issues").map((issue) => {
        const pos = recordAt(issue, "Pos");
        return toolFinding({
            column: numberField(pos, "Column", POSITION),
            ecosystem,
            file: stringField(pos, "Filename"),
            line: numberField(pos, "Line", POSITION),
            message: stringField(issue, "Text"),
            ruleId: stringField(issue, "FromLinter", TOOL),
            tool: TOOL,
        });
    });
};
