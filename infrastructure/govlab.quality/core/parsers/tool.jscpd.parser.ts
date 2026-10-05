import { isRecord, recordAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { duplicatedBlock } from "#configuration/strings/tool.strings";
import { jsonRecordsAt } from "#core/parsers/record.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "jscpd";
const RULE_ID = "jscpd/duplicate";

const locationOf = function locationOf(side: unknown): { file: string; line: number } {
    const record = isRecord(side) ? side : {};
    const start = recordAt(record, "start");
    const line = typeof start["line"] === "number" ? start["line"] : POSITION;
    return { file: stringField(record, "name"), line };
};

export const parseJscpdOutput = function parseJscpdOutput(stdout: string, ecosystem: string): Finding[] {
    return jsonRecordsAt(stdout, "duplicates").map((clone) => {
        const first = locationOf(clone["firstFile"]);
        const second = locationOf(clone["secondFile"]);
        return toolFinding({
            column: POSITION,
            ecosystem,
            file: second.file,
            line: second.line,
            message: duplicatedBlock(first.file, first.line),
            ruleId: RULE_ID,
            tool: TOOL,
        });
    });
};
