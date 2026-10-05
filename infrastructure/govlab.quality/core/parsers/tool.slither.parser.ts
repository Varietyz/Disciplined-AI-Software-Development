import {
    boolField,
    firstNumberField,
    firstRecord,
    recordAt,
    recordsAt,
    stringField,
} from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { advisoryFinding } from "#core/factories/finding.factory";
import { jsonRecord } from "#core/parsers/record.parser";

const TOOL = "slither";

export const slitherSucceeded = function slitherSucceeded(report: string): boolean {
    return boolField(jsonRecord(report || "{}"), "success");
};

export const parseSlitherReport = function parseSlitherReport(report: string, ecosystem: string): Finding[] {
    return recordsAt(recordAt(jsonRecord(report || "{}"), "results"), "detectors").map((detector) => {
        const mapping = recordAt(firstRecord(recordsAt(detector, "elements")), "source_mapping");
        return advisoryFinding({
            column: POSITION,
            ecosystem,
            file: stringField(mapping, "filename_relative"),
            line: firstNumberField(mapping, "lines", POSITION),
            message: stringField(detector, "description").trim(),
            ruleId: stringField(detector, "check", TOOL),
            tool: TOOL,
        });
    });
};
