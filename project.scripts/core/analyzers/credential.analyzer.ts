import { type Detector, detectedKinds } from "@ssot/secrets";
import { LINE_BREAK, TOKEN_BREAKS } from "#configuration/constants/credential.constants";
import type { CredentialFinding } from "#types/credential.types";

const tokensOf = function tokensOf(line: string): readonly string[] {
    const found: string[] = [];
    let current = "";
    for (const character of line) {
        if (TOKEN_BREAKS.has(character)) {
            found.push(current);
            current = "";
        } else {
            current += character;
        }
    }
    return [...found, current].filter((token) => token.length > 0);
};

export const credentialFindings = function credentialFindings(
    file: string,
    text: string,
    detectors: readonly Detector[],
): readonly CredentialFinding[] {
    return text.split(LINE_BREAK).flatMap((line, index) => {
        const kinds = [line, ...tokensOf(line)].flatMap((token) => detectedKinds(token, detectors));
        return kinds.slice(0, 1).map((kind) => ({ file, kind, line: index + 1 }));
    });
};
