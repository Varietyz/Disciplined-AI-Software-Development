import { HARDENING_DETAILS, nonAsciiDetail, parenDetail, reservedDetail } from "#configuration/strings/diagram.strings";
import type { MermaidHardeningCode, MermaidHardeningHit } from "#types/diagram.types";
import { mermaidBlocks } from "#core/parsers/diagram.parser";

const RESERVED_IN_LABEL: ReadonlySet<string> = new Set(["[", "]", "{", "}", "<", ">", "&"]);
const PARENS: ReadonlySet<string> = new Set(["(", ")"]);
const TRAILING_BLANKS: ReadonlySet<string> = new Set([" ", "\t", "\r"]);
const DIRECTION_WORD = "direction ";
const BREAK_TAG = "br";
const MAX_ASCII = 126;
const BR_END_OFFSET = 3;
const QUOTE = '"';
const OPEN_ANGLE = "<";
const SEMICOLON = ";";

const trailingHasContent = function trailingHasContent(line: string, from: number): boolean {
    for (let at = from; at < line.length; at += 1) {
        if (!TRAILING_BLANKS.has(line.charAt(at))) {
            return true;
        }
    }
    return false;
};

class MermaidLineScanner {
    public readonly hits: MermaidHardeningHit[] = [];
    private inQuote = false;
    private readonly line: string;
    private readonly lineNo: number;

    public constructor(line: string, lineNo: number) {
        this.line = line;
        this.lineNo = lineNo;
    }

    public scan(): MermaidHardeningHit[] {
        for (let at = 0; at < this.line.length; at += 1) {
            this.scanChar(at);
        }
        if (this.line.trim().toLowerCase().startsWith(DIRECTION_WORD)) {
            this.push("mermaid-subgraph-direction", 0, HARDENING_DETAILS.direction);
        }
        return this.hits;
    }

    private isHtmlBreak(char: string, at: number): boolean {
        return char === OPEN_ANGLE && this.line.slice(at + 1, at + BR_END_OFFSET).toLowerCase() === BREAK_TAG;
    }

    private isStatementSeparator(char: string, at: number): boolean {
        return char === SEMICOLON && !this.inQuote && trailingHasContent(this.line, at + 1);
    }

    private scanChar(at: number): void {
        const char = this.line.charAt(at);
        const code = this.line.codePointAt(at) ?? 0;
        if (code > MAX_ASCII) {
            this.push("mermaid-non-ascii", at, nonAsciiDetail(code));
            return;
        }
        if (char === QUOTE) {
            this.inQuote = !this.inQuote;
            return;
        }
        this.scanPlain(char, at);
    }

    private scanPlain(char: string, at: number): void {
        if (this.isHtmlBreak(char, at)) {
            this.push("mermaid-html-break", at, HARDENING_DETAILS.htmlBreak);
            return;
        }
        if (PARENS.has(char)) {
            this.push("mermaid-paren", at, parenDetail(char));
            return;
        }
        if (this.isStatementSeparator(char, at)) {
            this.push("mermaid-semicolon", at, HARDENING_DETAILS.semicolon);
            return;
        }
        if (this.inQuote && RESERVED_IN_LABEL.has(char)) {
            this.push("mermaid-label-reserved", at, reservedDetail(char));
        }
    }

    private push(code: MermaidHardeningCode, at: number, detail: string): void {
        this.hits.push({ code, col: at + 1, detail, line: this.lineNo });
    }
}

export const mermaidHardening = function mermaidHardening(source: string): MermaidHardeningHit[] {
    return mermaidBlocks(source).flatMap((block) =>
        block.code.split("\n").flatMap((line, offset) => new MermaidLineScanner(line, block.startLine + offset).scan()),
    );
};
