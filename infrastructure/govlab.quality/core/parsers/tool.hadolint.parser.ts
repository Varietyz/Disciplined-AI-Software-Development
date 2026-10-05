import { numberField, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { parseJsonRecords } from "#core/parsers/record.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "hadolint";

export const parseHadolintOutput = function parseHadolintOutput(stdout: string, ecosystem: string): Finding[] {
    return parseJsonRecords(stdout || "[]").map((comment) =>
        toolFinding({
            column: numberField(comment, "column", POSITION),
            ecosystem,
            file: stringField(comment, "file"),
            line: numberField(comment, "line", POSITION),
            message: stringField(comment, "message"),
            ruleId: stringField(comment, "code", TOOL),
            tool: TOOL,
        }),
    );
};
