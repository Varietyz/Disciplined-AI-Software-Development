import { INLINE_BLANKS, LINE_BREAK } from "#configuration/constants/source.constants";
import type { LineCount, LineScan } from "#types/source.types";

const stepLine = function stepLine(scan: LineScan, ch: string): LineScan {
    if (ch === LINE_BREAK) {
        return {
            blank: scan.sawNonSpace ? scan.blank : scan.blank + 1,
            runLength: 0,
            sawNonSpace: false,
            total: scan.total + 1,
        };
    }
    return {
        blank: scan.blank,
        runLength: scan.runLength + 1,
        sawNonSpace: scan.sawNonSpace || !INLINE_BLANKS.has(ch),
        total: scan.total,
    };
};

export const countLines = function countLines(text: string): LineCount {
    if (text.length === 0) {
        return { blank: 0, code: 0, total: 0 };
    }
    let scan: LineScan = { blank: 0, runLength: 0, sawNonSpace: false, total: 1 };
    for (const ch of text) {
        scan = stepLine(scan, ch);
    }
    const trailingEmpty = !scan.sawNonSpace && scan.runLength === 0;
    const total = trailingEmpty ? scan.total - 1 : scan.total;
    const blank = !scan.sawNonSpace && !trailingEmpty ? scan.blank + 1 : scan.blank;
    const safeTotal = Math.max(0, total);
    return { blank, code: safeTotal - blank, total: safeTotal };
};
