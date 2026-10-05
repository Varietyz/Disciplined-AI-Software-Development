import { boolField, numberField, recordAt, recordsAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { jsonRecordsAt } from "#core/parsers/record.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "rubocop";

export const parseRubocopOutput = function parseRubocopOutput(stdout: string, ecosystem: string): Finding[] {
    return jsonRecordsAt(stdout || "{}", "files").flatMap((file) =>
        recordsAt(file, "offenses")
            .filter((offense) => !boolField(offense, "corrected"))
            .map((offense) => {
                const location = recordAt(offense, "location");
                return toolFinding({
                    column: numberField(location, "start_column", POSITION),
                    ecosystem,
                    file: stringField(file, "path"),
                    fixable: boolField(offense, "correctable"),
                    line: numberField(location, "start_line", POSITION),
                    message: stringField(offense, "message"),
                    ruleId: stringField(offense, "cop_name", TOOL),
                    tool: TOOL,
                });
            }),
    );
};
