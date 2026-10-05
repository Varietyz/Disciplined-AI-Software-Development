import { isRecord, numberField, recordAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { jsonArray } from "#core/parsers/record.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "revive";

export const parseReviveOutput = function parseReviveOutput(
    stdout: string,
    ecosystem: string,
    advisory: boolean,
): Finding[] {
    return jsonArray(stdout || "[]")
        .filter(isRecord)
        .map((failure) => {
            const start = recordAt(recordAt(failure, "Position"), "Start");
            return toolFinding({
                advisory,
                column: numberField(start, "Column", POSITION),
                ecosystem,
                file: stringField(start, "Filename"),
                line: numberField(start, "Line", POSITION),
                message: stringField(failure, "Failure"),
                ruleId: stringField(failure, "RuleName", TOOL),
                tool: TOOL,
            });
        });
};
