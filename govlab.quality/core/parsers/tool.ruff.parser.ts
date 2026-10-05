import { hasField, numberField, recordAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { parseJsonRecords } from "#core/parsers/record.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "ruff";

export const parseRuffOutput = function parseRuffOutput(stdout: string, ecosystem: string): Finding[] {
    return parseJsonRecords(stdout || "[]").map((diagnostic) => {
        const location = recordAt(diagnostic, "location");
        return toolFinding({
            column: numberField(location, "column", POSITION),
            ecosystem,
            file: stringField(diagnostic, "filename"),
            fixable: hasField(diagnostic, "fix"),
            line: numberField(location, "row", POSITION),
            message: stringField(diagnostic, "message"),
            ruleId: stringField(diagnostic, "code", TOOL),
            tool: TOOL,
        });
    });
};
