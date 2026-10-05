import { NPM_MANIFEST, POSITION } from "#configuration/constants/tool.constants";
import { missingDependency, unusedDependency } from "#configuration/strings/tool.strings";
import { recordAt, stringArrayField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { advisoryFinding } from "#core/factories/finding.factory";
import { jsonRecord } from "#core/parsers/record.parser";

const TOOL = "depcheck";

const dependencyFinding = function dependencyFinding(ecosystem: string, ruleId: string, message: string): Finding {
    return advisoryFinding({
        column: POSITION,
        ecosystem,
        file: NPM_MANIFEST,
        line: POSITION,
        message,
        ruleId,
        tool: TOOL,
    });
};

export const parseDepcheckOutput = function parseDepcheckOutput(stdout: string, ecosystem: string): Finding[] {
    const report = jsonRecord(stdout || "{}");
    const unused = [...stringArrayField(report, "dependencies"), ...stringArrayField(report, "devDependencies")];
    return [
        ...unused.map((name) =>
            dependencyFinding(ecosystem, "unused-dependency", unusedDependency(name, NPM_MANIFEST)),
        ),
        ...Object.keys(recordAt(report, "missing")).map((name) =>
            dependencyFinding(ecosystem, "missing-dependency", missingDependency(name, NPM_MANIFEST)),
        ),
    ];
};
