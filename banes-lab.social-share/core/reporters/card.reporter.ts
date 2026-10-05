import type { CardFinding } from "#types/card.types";
import { FINDING_INDENT } from "#configuration/constants/card.constants";
import { SUBJECT_SEPARATOR } from "#configuration/strings/card.strings";
import process from "node:process";

const LINE_END = "\n";

export const say = function say(text: string): void {
    process.stdout.write(text + LINE_END);
};

export const conclude = function conclude(findings: readonly CardFinding[], clean: string): boolean {
    if (findings.length === 0) {
        say(clean);
        return true;
    }
    for (const finding of findings) {
        process.stderr.write(FINDING_INDENT + finding.card + SUBJECT_SEPARATOR + finding.message + LINE_END);
    }
    process.exitCode = 1;
    return false;
};
