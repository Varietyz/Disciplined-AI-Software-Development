import { FRONTMATTER_FENCE } from "#configuration/constants/document.constants";
import { LINE_BREAK } from "#configuration/constants/source.constants";

export const frontmatterValue = function frontmatterValue(text: string, key: string): string | null {
    if (!text.startsWith(FRONTMATTER_FENCE)) {
        return null;
    }
    const end = text.indexOf(`${LINE_BREAK}${FRONTMATTER_FENCE}`, FRONTMATTER_FENCE.length);
    const block = end === -1 ? text : text.slice(0, end);
    const needle = `${key}:`;
    for (const line of block.split(LINE_BREAK)) {
        const trimmed = line.trim();
        if (trimmed.startsWith(needle)) {
            return trimmed.slice(needle.length).trim();
        }
    }
    return null;
};
