import {
    CLEAN_PANEL,
    blockedPanel,
    findingAction,
    findingHead,
    findingMessage,
} from "#configuration/strings/validation.strings";
import type { Finding } from "#types/finding.types";

const locationOf = function locationOf(finding: Finding): string {
    return finding.line > 0 ? `${finding.file}:${String(finding.line)}:${String(finding.column)}` : finding.file;
};

const renderFinding = function renderFinding(finding: Finding): string[] {
    const action =
        finding.suggestion === undefined || finding.suggestion === "" ? [] : [findingAction(finding.suggestion)];
    return [findingHead(locationOf(finding), finding.ruleId), findingMessage(finding.message), ...action];
};

export const renderPanel = function renderPanel(findings: readonly Finding[]): string {
    return findings.length === 0
        ? CLEAN_PANEL
        : [blockedPanel(findings.length), "", ...findings.flatMap(renderFinding)].join("\n");
};
