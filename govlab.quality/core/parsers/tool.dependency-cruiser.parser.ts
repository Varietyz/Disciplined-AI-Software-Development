import { recordAt, recordsAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { advisoryFinding } from "#core/factories/finding.factory";
import { dependencyEdge } from "#configuration/strings/tool.strings";
import { jsonRecord } from "#core/parsers/record.parser";

const TOOL = "dependency-cruiser";
const UNKNOWN_END = "?";

export const parseDependencyCruiserOutput = function parseDependencyCruiserOutput(
    stdout: string,
    ecosystem: string,
): Finding[] {
    return recordsAt(recordAt(jsonRecord(stdout || "{}"), "summary"), "violations").map((violation) =>
        advisoryFinding({
            column: POSITION,
            ecosystem,
            file: stringField(violation, "from"),
            line: POSITION,
            message: dependencyEdge(
                stringField(violation, "from") || UNKNOWN_END,
                stringField(violation, "to") || UNKNOWN_END,
            ),
            ruleId: stringField(recordAt(violation, "rule"), "name", TOOL),
            tool: TOOL,
        }),
    );
};
