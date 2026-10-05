import { boolField, numberField, recordsAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { objectEntriesAt } from "#core/parsers/record.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "phpcs";

export const parsePhpcsOutput = function parsePhpcsOutput(stdout: string, ecosystem: string): Finding[] {
    return objectEntriesAt(stdout || "{}", "files").flatMap(([filePath, file]) =>
        recordsAt(file, "messages").map((message) =>
            toolFinding({
                column: numberField(message, "column", POSITION),
                ecosystem,
                file: filePath,
                fixable: boolField(message, "fixable"),
                line: numberField(message, "line", POSITION),
                message: stringField(message, "message"),
                ruleId: stringField(message, "source", TOOL),
                tool: TOOL,
            }),
        ),
    );
};
