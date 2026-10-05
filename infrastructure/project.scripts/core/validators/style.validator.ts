import { NO_UNUSED_SELECTORS, unusedHeading, unusedOverflow } from "#configuration/strings/style.strings";
import type { CheckVerdict } from "#types/validation.types";
import { SAMPLE_LIMIT } from "#configuration/constants/style.constants";
import type { UnusedSelector } from "#types/style.types";

export const styleVerdict = function styleVerdict(unused: readonly UnusedSelector[], report: string): CheckVerdict {
    if (unused.length === 0) {
        return { held: true, text: NO_UNUSED_SELECTORS };
    }
    const listed = unused.slice(0, SAMPLE_LIMIT).map((entry) => `  ${entry.file}  ${entry.selector}`);
    const overflow = unused.length > SAMPLE_LIMIT ? [unusedOverflow(unused.length - SAMPLE_LIMIT, report)] : [];
    return { held: false, text: [unusedHeading(unused.length), ...listed, ...overflow, ""].join("\n") };
};
