import type { TextCompression } from "#types/text.types";

export const compressedLine = function compressedLine(result: TextCompression): string {
    return `compress: wrote a brotli sibling for ${String(result.compressed)} changed text file(s) and reused ${String(result.reused)} from the cache\n`;
};
