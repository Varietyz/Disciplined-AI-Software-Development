import { arrayField, numberField, recordsAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { parseJsonRecords } from "#core/parsers/record.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "sqlfluff";

export const parseSqlfluffOutput = function parseSqlfluffOutput(stdout: string, ecosystem: string): Finding[] {
    return parseJsonRecords(stdout || "[]").flatMap((file) =>
        recordsAt(file, "violations").map((violation) =>
            toolFinding({
                column: numberField(violation, "start_line_pos", POSITION),
                ecosystem,
                file: stringField(file, "filepath"),
                fixable: arrayField(violation, "fixes").length > 0,
                line: numberField(violation, "start_line_no", POSITION),
                message: stringField(violation, "description"),
                ruleId: stringField(violation, "code", TOOL),
                tool: TOOL,
            }),
        ),
    );
};
