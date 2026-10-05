import { FAILURE_EXIT, FLAGS } from "#configuration/constants/invocation.constants";
import {
    RESOLUTION_CLEAN,
    RESOLUTION_REPORT_ONLY,
    missingCheckIndex,
    resolutionFailed,
} from "#configuration/strings/ontology.report.strings";
import { absolutePath, relativePath } from "@ssot/paths";
import { coverageLines, nativeLines, summaryLines } from "#core/formatters/ontology.formatter";
import { defectLines, worklistLines } from "#core/formatters/validation.formatter";
import { hasFlag, resolveArgv } from "@govlab/argv";
import { listDetailLines, targetLines, targetsOf } from "#core/formatters/ontology.report.formatter";
import { RESOLUTION_ARGV } from "#configuration/configs/invocation.config";
import { createGovlabContext } from "#core/factories/context.factory";
import { debugLogger } from "#core/reporters/ontology.reporter";
import { defineCheck } from "#core/factories/check.factory";
import { loadDeclaredChecks } from "#core/loaders/check.loader";
import process from "node:process";

defineCheck({ detects: [], enforces: ["architecture:semantic-consistency", "architecture:closed-vocabulary"] });

const argv = resolveArgv(RESOLUTION_ARGV);
const list = hasFlag(argv, FLAGS.list);
const strict = hasFlag(argv, FLAGS.strict);

const checksFile = absolutePath("govlabHost.checks");
const checks = loadDeclaredChecks(checksFile);
if (checks === null && strict) {
    process.stderr.write(`${missingCheckIndex(relativePath("govlabHost.checks"))}\n`);
    process.exit(FAILURE_EXIT);
}

const context = createGovlabContext({ checks: checks ?? [], logger: debugLogger(hasFlag(argv, FLAGS.debug)) });
const issues = context.validateResolution();
const lines = [
    ...summaryLines(issues, context.lex.all().length, targetsOf(issues).length),
    ...coverageLines(context.checkGaps()),
    ...nativeLines(issues),
    ...defectLines(issues),
    ...worklistLines(issues, list),
    ...targetLines(issues, list),
    ...(list ? listDetailLines(issues) : []),
];
process.stdout.write(`${lines.join("\n")}\n`);

if (strict && issues.total > 0) {
    process.stderr.write(`${resolutionFailed(issues.total)}\n`);
    process.exit(FAILURE_EXIT);
}
process.stdout.write(`${strict ? RESOLUTION_CLEAN : RESOLUTION_REPORT_ONLY}\n`);
