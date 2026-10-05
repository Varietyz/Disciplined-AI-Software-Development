import type { Finding } from "#types/finding.types";
import { runSummary } from "#configuration/strings/tool.strings";

const JSON_INDENT = 4;

const groupByFile = function groupByFile(findings: readonly Finding[]): Map<string, Finding[]> {
    const byFile = new Map<string, Finding[]>();
    for (const finding of findings) {
        byFile.set(finding.file, [...(byFile.get(finding.file) ?? []), finding]);
    }
    return byFile;
};

const markOf = function markOf(finding: Finding): string {
    if (finding.severity === "notice") {
        return "notice";
    }
    return finding.advisory ? "advisory" : finding.severity;
};

const countsOf = function countsOf(findings: readonly Finding[]): {
    advisory: number;
    errors: number;
    notices: number;
} {
    return {
        advisory: findings.filter((finding) => finding.severity === "error" && finding.advisory).length,
        errors: findings.filter((finding) => finding.severity === "error" && !finding.advisory).length,
        notices: findings.filter((finding) => finding.severity === "notice").length,
    };
};

export const formatFindings = function formatFindings(findings: readonly Finding[]): string {
    const out: string[] = [];
    for (const [file, fileFindings] of groupByFile(findings)) {
        out.push(file);
        for (const finding of fileFindings) {
            const message = finding.message.split("\n").join("\n    ");
            out.push(
                `  ${String(finding.line)}:${String(finding.column)}  ${markOf(finding)}  ${message}  ${finding.ruleId} (${finding.tool})`,
            );
        }
        out.push("");
    }
    return out.join("\n").trimEnd();
};

export const renderHuman = function renderHuman(
    outputs: readonly string[],
    findings: readonly Finding[],
    fixedCount: number,
): string {
    const body = outputs
        .map((output) => output.trim())
        .filter((output) => output.length > 0)
        .join("\n\n");
    const { advisory, errors, notices } = countsOf(findings);
    const summary = runSummary(errors, advisory, notices, fixedCount);
    return body.length > 0 ? `${body}\n\n${summary}\n` : `${summary}\n`;
};

export const renderJson = function renderJson(findings: readonly Finding[], fixedCount: number): string {
    const { advisory, errors, notices } = countsOf(findings);
    const summary = { advisory, errors, fixed: fixedCount, notices, total: findings.length };
    return `${JSON.stringify({ findings, summary }, null, JSON_INDENT)}\n`;
};
