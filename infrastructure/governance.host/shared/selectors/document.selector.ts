import type { DocumentText } from "../../types/writing.types.ts";

const LINE = "\n";
const FENCE = "```";
const FRONTMATTER = "---";
const CODE_MARK = "`";
const CODE_WORD = "code";
const CELL = "|";
const RULE_CELL_CHARS: ReadonlySet<string> = new Set(["-", ":", " "]);
const SPACE = " ";
const CODE_KEY = "code";
const POINTER = "/";
const LOCATION = ":";
const FRAGMENT = "#";

export const withoutCode = function withoutCode(text: string): string {
    let output = "";
    let inside = false;
    for (const char of text) {
        if (char === CODE_MARK) {
            output += inside ? "" : CODE_WORD;
            inside = !inside;
            continue;
        }
        output += inside ? "" : char;
    }
    return output;
};

const isRuleCell = function isRuleCell(cell: string): boolean {
    for (let at = 0; at < cell.length; at += 1) {
        if (!RULE_CELL_CHARS.has(cell.charAt(at))) {
            return false;
        }
    }
    return true;
};

const lineTexts = function lineTexts(line: string): readonly string[] {
    const prose = withoutCode(line).trim();
    if (!prose.startsWith(CELL)) {
        return [prose];
    }
    return prose
        .split(CELL)
        .map((cell) => cell.trim())
        .filter((cell) => cell.length > 0 && !isRuleCell(cell));
};

const frontmatterEnd = function frontmatterEnd(lines: readonly string[]): number {
    return lines[0]?.trim() === FRONTMATTER ? lines.indexOf(FRONTMATTER, 1) + 1 : 0;
};

export const markdownTexts = function markdownTexts(label: string, content: string): DocumentText[] {
    const lines = content.split(LINE).map((line) => line.trimEnd());
    const start = frontmatterEnd(lines);
    const texts: DocumentText[] = [];
    let fenced = false;
    for (const [index, line] of lines.entries()) {
        const body = index >= start;
        const fence = body && line.trimStart().startsWith(FENCE);
        fenced = fence ? !fenced : fenced;
        if (body && !fence && !fenced && line.trim().length > 0) {
            const at = `${label}${LOCATION}${String(index + 1)}`;
            texts.push(...lineTexts(line).map((text) => ({ at, text })));
        }
    }
    return texts;
};

const unfencedLines = function unfencedLines(value: string): string[] {
    const lines: string[] = [];
    let fenced = false;
    for (const line of value.split(LINE)) {
        const fence = line.trimStart().startsWith(FENCE);
        fenced = fence ? !fenced : fenced;
        if (!fence && !fenced) {
            lines.push(line);
        }
    }
    return lines;
};

export const jsonTexts = function jsonTexts(label: string, value: unknown, pointer = ""): DocumentText[] {
    if (typeof value === "string") {
        const at = `${label}${FRAGMENT}${pointer}`;
        return unfencedLines(value)
            .filter((line) => line.includes(SPACE))
            .map((line) => ({ at, text: withoutCode(line) }));
    }
    if (Array.isArray(value)) {
        return value.flatMap((item, index) => jsonTexts(label, item, `${pointer}${POINTER}${String(index)}`));
    }
    if (typeof value !== "object" || value === null) {
        return [];
    }
    return Object.entries(value).flatMap(([key, item]) =>
        key === CODE_KEY ? [] : jsonTexts(label, item, `${pointer}${POINTER}${key}`),
    );
};
