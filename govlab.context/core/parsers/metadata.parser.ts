import { DECLARATION_PREFIX, DECL_META_TOKENS, FRONTMATTER_FENCE } from "#configuration/constants/grammar.constants";
import type { FrontmatterRead, PagDeclaration } from "#types/grammar.document.types";

const FIELD_SEPARATOR = ":";
const WORD_SEPARATOR = " ";
const LINE_FEED = "\n";

export const parseDeclaration = function parseDeclaration(trimmed: string, line: number): PagDeclaration {
    const tokens = trimmed.slice(DECLARATION_PREFIX.length).split(WORD_SEPARATOR).filter(Boolean);
    return {
        description: tokens.slice(DECL_META_TOKENS).join(WORD_SEPARATOR),
        line,
        type: tokens[0] ?? null,
        verb: tokens[1] ?? null,
    };
};

export const readFrontmatter = function readFrontmatter(lines: string[]): FrontmatterRead {
    const start = lines.findIndex((line) => line.trim() !== "");
    if (start === -1 || lines[start]?.trim() !== FRONTMATTER_FENCE) {
        return { end: start === -1 ? lines.length : start, frontmatter: null };
    }
    const close = lines.findIndex((line, index) => index > start && line.trim() === FRONTMATTER_FENCE);
    const end = close === -1 ? lines.length : close;
    return { end: close === -1 ? end : end + 1, frontmatter: lines.slice(start + 1, end).join(LINE_FEED) };
};

export const fieldOf = function fieldOf(trimmed: string): { key: string; value: string } | null {
    const colon = trimmed.indexOf(FIELD_SEPARATOR);
    return colon > 0 ? { key: trimmed.slice(0, colon).trim(), value: trimmed.slice(colon + 1).trim() } : null;
};
