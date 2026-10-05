import { numberField, recordAt, recordsAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { advisoryFinding } from "#core/factories/finding.factory";
import { jsonRecordsAt } from "#core/parsers/record.parser";

const TOOL = "trivy";

export const parseTrivyOutput = function parseTrivyOutput(stdout: string, ecosystem: string): Finding[] {
    return jsonRecordsAt(stdout || "{}", "Results").flatMap((result) =>
        recordsAt(result, "Misconfigurations").map((misconfig) =>
            advisoryFinding({
                column: POSITION,
                ecosystem,
                file: stringField(result, "Target"),
                line: numberField(recordAt(misconfig, "CauseMetadata"), "StartLine", POSITION),
                message: stringField(misconfig, "Title") || stringField(misconfig, "Message"),
                ruleId: stringField(misconfig, "ID", TOOL),
                tool: TOOL,
            }),
        ),
    );
};
