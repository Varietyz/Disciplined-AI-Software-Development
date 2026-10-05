import { firstRecord, numberField, recordAt, recordsAt, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { jsonRecord } from "#core/parsers/record.parser";
import { toolFinding } from "#core/factories/finding.factory";

const FILE_SCHEMES = ["file:///", "file://", "file:/"];

const cleanUri = function cleanUri(uri: string): string {
    const scheme = FILE_SCHEMES.find((prefix) => uri.startsWith(prefix));
    return scheme === undefined ? uri : uri.slice(scheme.length);
};

const sarifFinding = function sarifFinding(
    result: Record<string, unknown>,
    context: { ecosystem: string; tool: string },
): Finding {
    const location = firstRecord(recordsAt(result, "locations"));
    const physical = recordAt(location, "physicalLocation");
    const region = recordAt(physical, "region");
    const artifact = recordAt(physical, "artifactLocation");
    return toolFinding({
        column: numberField(region, "startColumn", POSITION),
        ecosystem: context.ecosystem,
        file: cleanUri(stringField(artifact, "uri")),
        line: numberField(region, "startLine", POSITION),
        message: stringField(recordAt(result, "message"), "text"),
        ruleId: stringField(result, "ruleId", context.tool),
        tool: context.tool,
    });
};

export const parseSarifReport = function parseSarifReport(stdout: string, ecosystem: string, tool: string): Finding[] {
    return recordsAt(jsonRecord(stdout || "{}"), "runs").flatMap((run) =>
        recordsAt(run, "results").map((result) => sarifFinding(result, { ecosystem, tool })),
    );
};
