import type { Finding } from "#types/finding.types";

export const withSupport = function withSupport(findings: readonly (Finding | null)[], support: number): Finding[] {
    return findings
        .filter((finding): finding is Finding => finding !== null)
        .map((finding) => ({ ...finding, support }));
};
