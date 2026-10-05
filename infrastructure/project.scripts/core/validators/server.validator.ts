import type { ListenerSurfaces, TransportFinding } from "#types/server.types";
import { plaintextHeading, plaintextListener, transportHeld } from "#configuration/strings/server.strings";
import type { CheckVerdict } from "#types/validation.types";

export const transportFindings = function transportFindings(
    file: string,
    surfaces: ListenerSurfaces,
): TransportFinding[] {
    const { preview, server } = surfaces;
    return [
        ...(server !== undefined && server.https === undefined && server.middlewareMode !== true
            ? [{ file, surface: "server" }]
            : []),
        ...(preview !== undefined && preview.https === undefined ? [{ file, surface: "preview" }] : []),
    ];
};

export const transportVerdict = function transportVerdict(
    findings: readonly TransportFinding[],
    configs: number,
): CheckVerdict {
    if (findings.length === 0) {
        return { held: true, text: transportHeld(configs) };
    }
    const listed = findings.map((finding) => plaintextListener(finding.file, finding.surface));
    return { held: false, text: [plaintextHeading(findings.length), ...listed, ""].join("\n") };
};
