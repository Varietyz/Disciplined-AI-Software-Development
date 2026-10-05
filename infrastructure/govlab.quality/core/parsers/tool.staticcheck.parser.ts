import { numberField, recordAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { advisoryFinding } from "#core/factories/finding.factory";
import { jsonRecord } from "#core/parsers/record.parser";
import { parseLines } from "#core/parsers/location.parser";

const TOOL = "staticcheck";

const lineFinding = function lineFinding(line: string, ecosystem: string): Finding | null {
    const issue = jsonRecord(line);
    const location = recordAt(issue, "location");
    const file = stringField(location, "file");
    if (line.length === 0 || file.length === 0) {
        return null;
    }
    return advisoryFinding({
        column: numberField(location, "column", POSITION),
        ecosystem,
        file,
        line: numberField(location, "line", POSITION),
        message: stringField(issue, "message"),
        ruleId: stringField(issue, "code", TOOL),
        tool: TOOL,
    });
};

export const parseStaticcheckOutput = function parseStaticcheckOutput(stdout: string, ecosystem: string): Finding[] {
    return parseLines(stdout, (line) => lineFinding(line, ecosystem));
};
