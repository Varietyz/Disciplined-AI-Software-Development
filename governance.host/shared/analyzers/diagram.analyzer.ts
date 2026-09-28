import {
    DIAGRAM_EDGE_CHARACTERS,
    DIAGRAM_GROUP_KEYWORD,
    DIAGRAM_HEADERS,
    DIAGRAM_IDENTIFIER_CHARACTERS,
    DIAGRAM_KEYWORDS,
    DIAGRAM_SHAPE_OPENERS,
} from "../manifests/diagram.manifest.ts";
import type { ReservedNodeId } from "../../types/diagram.types.ts";

const LINE_END = "\n";
const SPACE = " ";
const QUOTE = '"';
const LABEL_BAR = "|";
const OPEN_CLOSE: ReadonlyMap<string, string> = new Map([
    ["[", "]"],
    ["(", ")"],
    ["{", "}"],
]);

interface Token {
    readonly end: number;
    readonly start: number;
    readonly word: string;
}

const skipQuoted = function skipQuoted(line: string, from: number): number {
    const close = line.indexOf(QUOTE, from + 1);
    return close === -1 ? line.length : close + 1;
};

const skipBracket = function skipBracket(line: string, from: number, close: string): number {
    let depth = 0;
    let at = from;
    while (at < line.length) {
        const char = line.charAt(at);
        if (char === QUOTE) {
            at = skipQuoted(line, at);
            continue;
        }
        if (OPEN_CLOSE.has(char)) {
            depth += 1;
        }
        if (char === close) {
            depth -= 1;
            if (depth === 0) {
                return at + 1;
            }
        }
        at += 1;
    }
    return line.length;
};

const skipLabel = function skipLabel(line: string, from: number): number {
    const close = line.indexOf(LABEL_BAR, from + 1);
    return close === -1 ? line.length : close + 1;
};

const skipInlineLabel = function skipInlineLabel(line: string, from: number): number {
    let at = from;
    while (at < line.length) {
        const char = line.charAt(at);
        const next = line.charAt(at + 1);
        if (DIAGRAM_EDGE_CHARACTERS.has(char) && DIAGRAM_EDGE_CHARACTERS.has(next)) {
            return at;
        }
        at += 1;
    }
    return line.length;
};

const ARROW_HEAD = ">";
const LABEL_OPENER_LENGTH = 2;

const skipEdge = function skipEdge(line: string, from: number): number {
    let at = from;
    while (at < line.length && DIAGRAM_EDGE_CHARACTERS.has(line.charAt(at))) {
        at += 1;
    }
    const run = line.slice(from, at);
    if (run.endsWith(ARROW_HEAD) || run.length !== LABEL_OPENER_LENGTH) {
        return at;
    }
    const rest = line.slice(at).trimStart();
    const opensLabel = rest.length > 0 && DIAGRAM_IDENTIFIER_CHARACTERS.includes(rest.charAt(0));
    if (!opensLabel) {
        return at;
    }
    const labelEnd = skipInlineLabel(line, line.length - rest.length);
    return labelEnd >= line.length ? labelEnd : skipEdge(line, labelEnd);
};

const readToken = function readToken(line: string, from: number): Token {
    let at = from;
    while (at < line.length && DIAGRAM_IDENTIFIER_CHARACTERS.includes(line.charAt(at))) {
        at += 1;
    }
    return { end: at, start: from, word: line.slice(from, at) };
};

const groupIdEnd = function groupIdEnd(line: string, from: number): number {
    const rest = line.slice(from).trimStart();
    return readToken(line, line.length - rest.length).end;
};

const nodeTokensOf = function nodeTokensOf(line: string): Token[] {
    const tokens: Token[] = [];
    let at = 0;
    while (at < line.length) {
        const char = line.charAt(at);
        const close = OPEN_CLOSE.get(char);
        if (close !== undefined) {
            at = skipBracket(line, at, close);
        } else if (char === QUOTE) {
            at = skipQuoted(line, at);
        } else if (char === LABEL_BAR) {
            at = skipLabel(line, at);
        } else if (DIAGRAM_EDGE_CHARACTERS.has(char)) {
            at = skipEdge(line, at);
        } else if (DIAGRAM_IDENTIFIER_CHARACTERS.includes(char)) {
            const token = readToken(line, at);
            tokens.push(token);
            at = token.word === DIAGRAM_GROUP_KEYWORD ? groupIdEnd(line, token.end) : token.end;
        } else {
            at += 1;
        }
    }
    return tokens;
};

const nextChar = function nextChar(line: string, from: number): string {
    return line.slice(from).trimStart().charAt(0);
};

const previousChar = function previousChar(line: string, before: number): string {
    const head = line.slice(0, before).trimEnd();
    return head.at(-1) ?? "";
};

const usedAsNode = function usedAsNode(line: string, token: Token): boolean {
    const after = nextChar(line, token.end);
    const before = previousChar(line, token.start);
    const target = DIAGRAM_EDGE_CHARACTERS.has(before) || before === LABEL_BAR;
    return DIAGRAM_SHAPE_OPENERS.has(after) || DIAGRAM_EDGE_CHARACTERS.has(after) || target;
};

export const reservedNodeIdsOf = function reservedNodeIdsOf(source: string): ReservedNodeId[] {
    const found: ReservedNodeId[] = [];
    source.split(LINE_END).forEach((raw, index) => {
        const line = raw.trim();
        for (const token of nodeTokensOf(line)) {
            if (DIAGRAM_KEYWORDS.has(token.word) && usedAsNode(line, token)) {
                found.push({ line: index + 1, word: token.word });
            }
        }
    });
    return found;
};

export const isDiagramSource = function isDiagramSource(source: string): boolean {
    const [first = ""] = source.trimStart().split(LINE_END);
    const [keyword = ""] = first.split(SPACE);
    return DIAGRAM_HEADERS.has(keyword);
};
