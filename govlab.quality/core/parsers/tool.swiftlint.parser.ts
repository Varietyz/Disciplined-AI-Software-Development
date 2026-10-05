import { numberField, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { parseJsonRecords } from "#core/parsers/record.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "swiftlint";

export const parseSwiftlintOutput = function parseSwiftlintOutput(stdout: string, ecosystem: string): Finding[] {
    return parseJsonRecords(stdout || "[]").map((violation) =>
        toolFinding({
            column: numberField(violation, "character", POSITION),
            ecosystem,
            file: stringField(violation, "file"),
            line: numberField(violation, "line", POSITION),
            message: stringField(violation, "reason").trim(),
            ruleId: stringField(violation, "rule_id", TOOL),
            tool: TOOL,
        }),
    );
};
