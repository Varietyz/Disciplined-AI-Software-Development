import type { PathRef, SpanDelims } from "#types/reference.types";
import { proseLines } from "#core/parsers/markdown.parser";

const PATH_DISQUALIFIERS: readonly string[] = ["://", " ", "`", "*", "<", ">", "...", "[", "]", "\\", "{", "}"];
const PACKAGE_MARK = "@";
const SEPARATOR = "/";
const BACKTICK_SPAN: SpanDelims = { close: "`", open: "`" };
const LINK_SPAN: SpanDelims = { close: ")", open: "](" };

const looksLikePath = function looksLikePath(candidate: string): boolean {
    if (candidate.length === 0 || !candidate.includes(SEPARATOR) || candidate.startsWith(PACKAGE_MARK)) {
        return false;
    }
    return !PATH_DISQUALIFIERS.some((bad) => candidate.includes(bad));
};

const spansIn = function spansIn(line: string, lineNo: number, delims: SpanDelims): PathRef[] {
    const refs: PathRef[] = [];
    let start = line.indexOf(delims.open);
    while (start !== -1) {
        const from = start + delims.open.length;
        const end = line.indexOf(delims.close, from);
        if (end === -1) {
            return refs;
        }
        const content = line.slice(from, end);
        if (looksLikePath(content)) {
            refs.push({ col: from + 1, line: lineNo, path: content });
        }
        start = line.indexOf(delims.open, end + 1);
    }
    return refs;
};

export const pathReferences = function pathReferences(source: string): PathRef[] {
    return proseLines(source).flatMap(({ line, lineNo }) => [
        ...spansIn(line, lineNo, BACKTICK_SPAN),
        ...spansIn(line, lineNo, LINK_SPAN),
    ]);
};
