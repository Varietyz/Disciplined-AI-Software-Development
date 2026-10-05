import { numberField, recordAt, recordsAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { jsonRecordsAt } from "#core/parsers/record.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "oxlint";

const ruleIdFrom = function ruleIdFrom(code: string): string {
    const open = code.indexOf("(");
    const close = code.lastIndexOf(")");
    if (open === -1 || close === -1 || close < open) {
        return code || TOOL;
    }
    return `${code.slice(0, open)}/${code.slice(open + 1, close)}`;
};

const firstSpan = function firstSpan(diagnostic: Record<string, unknown>): Record<string, unknown> {
    const [label] = recordsAt(diagnostic, "labels");
    return label === undefined ? {} : recordAt(label, "span");
};

export const parseOxlintOutput = function parseOxlintOutput(stdout: string, ecosystem: string): Finding[] {
    return jsonRecordsAt(stdout, "diagnostics").map((diagnostic) => {
        const span = firstSpan(diagnostic);
        return toolFinding({
            column: numberField(span, "column", POSITION),
            ecosystem,
            file: stringField(diagnostic, "filename"),
            line: numberField(span, "line", POSITION),
            message: stringField(diagnostic, "message"),
            ruleId: ruleIdFrom(stringField(diagnostic, "code", TOOL)),
            tool: TOOL,
        });
    });
};
