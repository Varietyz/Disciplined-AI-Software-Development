import type { DocumentSource, PagText } from "#types/grammar.document.types";
import { FENCE, FIRST_LINE, LINE_BREAK, PAG_FENCE_INFO } from "#configuration/constants/document.constants";
import { splitLines } from "#core/converters/text.converter";

const isPagFenceOpen = function isPagFenceOpen(trimmed: string): boolean {
    return trimmed.startsWith(FENCE) && trimmed.includes(PAG_FENCE_INFO);
};

export const pagBlockOf = function pagBlockOf(text: string): PagText | null {
    const lines = splitLines(text);
    const open = lines.findIndex((line) => isPagFenceOpen(line.trim()));
    if (open === -1) {
        return null;
    }
    const close = lines.findIndex((line, index) => index > open && line.trim().startsWith(FENCE));
    const body = lines.slice(open + 1, close === -1 ? lines.length : close);
    return { firstLine: open + 2, text: body.join(LINE_BREAK) };
};

export const pagTextOf = function pagTextOf(source: DocumentSource, text: string): PagText | null {
    return source.kind === "template" ? pagBlockOf(text) : { firstLine: FIRST_LINE, text };
};
