import { describeFindings, formatFinding } from "#core/formatters/finding.formatter";
import type { Categories } from "#types/finding.types";
import { printErr } from "#core/reporters/base.reporter";

export const emitFindings = function emitFindings(relDoc: string, all: Categories): void {
    for (const described of describeFindings(all)) {
        printErr(formatFinding(described, relDoc));
    }
};
