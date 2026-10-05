import { boolField, firstRecord, numberField, recordAt, recordsAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { jsonRecord } from "#core/parsers/record.parser";
import { parseLines } from "#core/parsers/location.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "clippy";
const MACHINE_APPLICABLE = "MachineApplicable";
const COMPILER_MESSAGE = "compiler-message";

const isFixable = function isFixable(body: Record<string, unknown>): boolean {
    return (
        recordsAt(body, "spans").some((span) => stringField(span, "suggestion_applicability") === MACHINE_APPLICABLE) ||
        recordsAt(body, "children").some((child) => isFixable(child))
    );
};

const lineFinding = function lineFinding(line: string, ecosystem: string): Finding | null {
    const entry = jsonRecord(line);
    const body = recordAt(entry, "message");
    const code = stringField(recordAt(body, "code"), "code");
    if (stringField(entry, "reason") !== COMPILER_MESSAGE || code.length === 0) {
        return null;
    }
    const spans = recordsAt(body, "spans");
    const primary = spans.find((span) => boolField(span, "is_primary")) ?? firstRecord(spans);
    return toolFinding({
        column: numberField(primary, "column_start", POSITION),
        ecosystem,
        file: stringField(primary, "file_name"),
        fixable: isFixable(body),
        line: numberField(primary, "line_start", POSITION),
        message: stringField(body, "message"),
        ruleId: code,
        tool: TOOL,
    });
};

export const parseClippyOutput = function parseClippyOutput(stdout: string, ecosystem: string): Finding[] {
    return parseLines(stdout, (line) => lineFinding(line, ecosystem));
};
