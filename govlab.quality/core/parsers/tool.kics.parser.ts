import { numberField, recordsAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { advisoryFinding } from "#core/factories/finding.factory";
import { jsonRecordsAt } from "#core/parsers/record.parser";

const TOOL = "kics";

export const parseKicsReport = function parseKicsReport(report: string, ecosystem: string): Finding[] {
    return jsonRecordsAt(report || "{}", "queries").flatMap((query) =>
        recordsAt(query, "files").map((match) =>
            advisoryFinding({
                column: POSITION,
                ecosystem,
                file: stringField(match, "file_name"),
                line: numberField(match, "line", POSITION),
                message: stringField(query, "description").trim(),
                ruleId: stringField(query, "query_name", TOOL),
                tool: TOOL,
            }),
        ),
    );
};
