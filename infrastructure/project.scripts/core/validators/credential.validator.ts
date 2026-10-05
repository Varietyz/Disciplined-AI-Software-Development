import { credentialBroken, credentialHeld } from "#configuration/strings/credential.strings";
import type { CheckVerdict } from "#types/validation.types";
import type { CredentialFinding } from "#types/credential.types";

export const credentialVerdict = function credentialVerdict(
    findings: readonly CredentialFinding[],
    scanned: number,
): CheckVerdict {
    if (findings.length === 0) {
        return { held: true, text: credentialHeld(scanned) };
    }
    return {
        held: false,
        text: credentialBroken(findings.map((finding) => `  ${finding.file}:${String(finding.line)}  ${finding.kind}`)),
    };
};
