import { lengthBroken, lengthHeld } from "#configuration/strings/source.strings";
import type { CheckVerdict } from "#types/validation.types";
import type { LengthFinding } from "#types/source.types";

const COUNT_WIDTH = 4;

export const nonBlankLines = function nonBlankLines(text: string): number {
    return text.split("\n").filter((line) => line.trim().length > 0).length;
};

export const lengthVerdict = function lengthVerdict(
    findings: readonly LengthFinding[],
    cap: number,
    scanned: number,
): CheckVerdict {
    if (findings.length === 0) {
        return { held: true, text: lengthHeld(cap, scanned) };
    }
    const rows = findings
        .toSorted((left, right) => right.count - left.count)
        .map((finding) => `  ${String(finding.count).padStart(COUNT_WIDTH)}  ${finding.file}`);
    return { held: false, text: lengthBroken(cap, rows) };
};
