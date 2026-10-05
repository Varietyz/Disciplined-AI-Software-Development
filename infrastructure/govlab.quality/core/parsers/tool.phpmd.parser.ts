import { numberField, recordsAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { jsonRecordsAt } from "#core/parsers/record.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "phpmd";

export const parsePhpmdOutput = function parsePhpmdOutput(stdout: string, ecosystem: string): Finding[] {
    return jsonRecordsAt(stdout || "{}", "files").flatMap((file) =>
        recordsAt(file, "violations").map((violation) =>
            toolFinding({
                column: POSITION,
                ecosystem,
                file: stringField(file, "file"),
                line: numberField(violation, "beginLine", POSITION),
                message: stringField(violation, "description"),
                ruleId: stringField(violation, "rule", TOOL),
                tool: TOOL,
            }),
        ),
    );
};
