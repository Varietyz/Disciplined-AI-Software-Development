import { firstNumberField, recordAt, recordsAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { advisoryFinding } from "#core/factories/finding.factory";
import { jsonRecordsFlexible } from "#core/parsers/record.parser";

const TOOL = "checkov";
const SEPARATORS = new Set(["/", "\\"]);

const stripLeadingSep = function stripLeadingSep(file: string): string {
    return SEPARATORS.has(file.charAt(0)) ? file.slice(1) : file;
};

export const parseCheckovOutput = function parseCheckovOutput(stdout: string, ecosystem: string): Finding[] {
    return jsonRecordsFlexible(stdout || "[]").flatMap((block) =>
        recordsAt(recordAt(block, "results"), "failed_checks").map((check) =>
            advisoryFinding({
                column: POSITION,
                ecosystem,
                file: stripLeadingSep(stringField(check, "file_path")),
                line: firstNumberField(check, "file_line_range", POSITION),
                message: stringField(check, "check_name"),
                ruleId: stringField(check, "check_id", TOOL),
                tool: TOOL,
            }),
        ),
    );
};
