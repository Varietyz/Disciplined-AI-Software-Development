import { TAXONOMY_MESSAGES, taxonomyFindingLine, taxonomySummary } from "../../shared/strings/taxonomy.strings.ts";
import { coverageFindings } from "../../shared/analyzers/taxonomy.coverage.analyzer.ts";
import { defineCheck } from "@govlab/context/check";
import { taxonomyRoots } from "../../shared/manifests/taxonomy.manifest.ts";
import process from "node:process";
import { taxonomyReport } from "../../shared/analyzers/taxonomy.tree.analyzer.ts";

defineCheck({
    detects: [],
    enforces: [
        "architecture:declared-jurisdiction",
        "architecture:bounded-nesting-depth",
        "architecture:closed-vocabulary",
        "architecture:concern-folder-correspondence",
    ],
});

const FAILURE = 1;

const report = taxonomyReport();
const findings = [...report.findings, ...coverageFindings()];

for (const finding of findings) {
    const render = TAXONOMY_MESSAGES[finding.messageId];
    const message = render === undefined ? "" : render(finding.data);
    process.stderr.write(taxonomyFindingLine(finding.path, finding.messageId, message));
}
process.stdout.write(taxonomySummary(findings.length, report.assessed, taxonomyRoots().length));
if (findings.length > 0) {
    process.exitCode = FAILURE;
}
