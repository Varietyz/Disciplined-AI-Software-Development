import type { CanonDefects } from "#types/canon.types";
import { KIND_SET } from "#configuration/constants/canon.constants";

const KIND_COUNT = KIND_SET.length;

export const canonReport = function canonReport(input: {
    algoRecords: number;
    archRecords: number;
    defects: CanonDefects;
    total: number;
}): string {
    const { defects } = input;
    const unknownTypes =
        defects.unknownType.size > 0 ? [...defects.unknownType].join(", ") : "(good — every type collapses)";
    return `${[
        "canon validate — post-migration invariant across the ontology\n",
        `  arch records:                 ${String(input.archRecords)}`,
        `  arch type not a kind:         ${String(defects.archType.length)}  (of ${String(KIND_COUNT)} canonical kinds)`,
        `  arch type with NO kind map:   ${String(defects.unknownType.size)}  ${unknownTypes}`,
        `  arch missing/!canonical id:   ${String(defects.archId.length)}`,
        `  arch de-abbreviation renames: ${String(defects.archRename.length)}  (informational)`,
        `  arch resolvable-variant edges:${String(defects.archEdge.length)}  (informational — display form, loader-resolved)`,
        `  algo records:                 ${String(input.algoRecords)}`,
        `  algo non-kebab ids:           ${String(defects.algoId.length)}`,
        `  algo internal forces:         ${String(new Set(defects.algoForce).size)}  (informational — algo vocabulary, bridged via relatesTo)`,
        `\n  TOTAL canon defects (id + type): ${String(input.total)}`,
    ].join("\n")}\n`;
};

export const canonFailed = function canonFailed(total: number): string {
    return `\n✖ canon gate FAILED — ${String(total)} defect(s)\n`;
};

export const CANON_CLEAN = "\n✓ canon gate clean\n";

export const CANON_REPORT_ONLY = "\n(report-only — pass --strict to gate)\n";
