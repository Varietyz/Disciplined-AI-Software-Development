import { hasField, numberField, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { parseJsonRecords } from "#core/parsers/record.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "shellcheck";
const CODE_PREFIX = "SC";

export const parseShellcheckOutput = function parseShellcheckOutput(stdout: string, ecosystem: string): Finding[] {
    return parseJsonRecords(stdout || "[]").map((comment) =>
        toolFinding({
            column: numberField(comment, "column", POSITION),
            ecosystem,
            file: stringField(comment, "file"),
            fixable: hasField(comment, "fix"),
            line: numberField(comment, "line", POSITION),
            message: stringField(comment, "message"),
            ruleId: `${CODE_PREFIX}${String(numberField(comment, "code", 0))}`,
            tool: TOOL,
        }),
    );
};
