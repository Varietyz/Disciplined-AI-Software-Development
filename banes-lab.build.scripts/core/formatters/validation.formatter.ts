import { DISCOVERY_CLEAN, discoveryFindingsHeading } from "#configuration/strings/validation.strings";
import type { Finding } from "#types/validation.types";

export const reportOf = function reportOf(findings: readonly Finding[]): string {
    return findings.length === 0
        ? DISCOVERY_CLEAN
        : [
              discoveryFindingsHeading(findings.length),
              ...findings.map((finding) => `  ${finding.file}  ${finding.message}`),
              "",
          ].join("\n");
};
