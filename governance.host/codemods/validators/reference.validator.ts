import {
    GROUP_END,
    REFERENCES_CLEAN,
    constructGroupLine,
    referenceLine,
    referencesFailed,
} from "../strings/validation.strings.ts";
import type { ReferenceFinding } from "../../types/analyzer.types.ts";
import { collectReferenceFindings } from "../analyzers/reference.analyzer.ts";
import { defineCheck } from "@govlab/context/check";

defineCheck({ detects: [], enforces: ["architecture:traceability"] });

const findings = collectReferenceFindings();

if (findings.length === 0) {
    process.stdout.write(REFERENCES_CLEAN);
    process.exit(0);
}

const byConstruct = new Map<string, ReferenceFinding[]>();
for (const finding of findings) {
    byConstruct.set(finding.construct, [...(byConstruct.get(finding.construct) ?? []), finding]);
}

process.stderr.write(referencesFailed(findings.length));

for (const [construct, group] of [...byConstruct.entries()].sort((a, b) => b[1].length - a[1].length)) {
    process.stderr.write(constructGroupLine(construct, group.length));
    for (const finding of group) {
        process.stderr.write(referenceLine(finding.file, finding.value, finding.token));
    }
    process.stderr.write(GROUP_END);
}

process.exit(1);
