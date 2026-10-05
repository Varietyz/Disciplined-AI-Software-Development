import { FAILURE_EXIT, FLAGS } from "#configuration/constants/invocation.constants";
import {
    PAG_CLEAN,
    PAG_HEADING,
    PAG_REPORT_ONLY,
    defectRow,
    documentRow,
    documentsTotal,
    pagFailed,
} from "#configuration/strings/ontology.report.strings";
import { hasFlag, resolveArgv } from "@govlab/argv";
import { PAG_ARGV } from "#configuration/configs/invocation.config";
import { defineCheck } from "#core/factories/check.factory";
import { executableDocuments } from "#core/loaders/document.loader";
import process from "node:process";
import { validateDocuments } from "#core/validators/document.validator";

defineCheck({ detects: [], enforces: ["architecture:schema-validation"] });

const strict = hasFlag(resolveArgv(PAG_ARGV), FLAGS.strict);
const verdicts = validateDocuments(executableDocuments());
const total = verdicts.reduce((sum, verdict) => sum + verdict.defects.length, 0);
const lines = [
    PAG_HEADING,
    ...verdicts.flatMap((verdict) => [
        documentRow(verdict.defects.length === 0, verdict.source.relative, verdict.defects.length),
        ...verdict.defects.map((defect) => defectRow(verdict.source.relative, defect.line, defect.code, defect.token)),
    ]),
    documentsTotal(verdicts.length, total),
];
process.stdout.write(`${lines.join("\n")}\n`);

if (strict && total > 0) {
    process.stderr.write(`${pagFailed(total)}\n`);
    process.exit(FAILURE_EXIT);
}
process.stdout.write(`${strict ? PAG_CLEAN : PAG_REPORT_ONLY}\n`);
