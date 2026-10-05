import type { BindingFinding } from "#types/binding.types";

export const bindingClean = function bindingClean(count: number): string {
    return `rule bindings: all ${String(count)} rules bind to a remediation contract and declare quality concepts that resolve\n`;
};

export const bindingFailed = function bindingFailed(count: number): string {
    return `rule bindings: ${String(count)} finding(s). A rule's id is the id of the algorithms contract it enforces, and its canonical list names quality concepts.\n`;
};

const REASON_TEXT: Readonly<Record<BindingFinding["reason"], string>> = {
    "no-canonical": "declares no canonical quality concepts; build its meta with govlabMeta and name them",
    "no-contract": "has no algorithms contract with its id; rename it to its contract, or author the contract",
    "unknown-concept": "names a concept the quality catalog does not register",
};

export const bindingLine = function bindingLine(finding: BindingFinding): string {
    const detail = finding.detail.length > 0 ? ` (${finding.detail})` : "";
    return `  ${finding.id}: ${REASON_TEXT[finding.reason]}${detail}\n`;
};
