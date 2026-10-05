const QUOTE_CHARS: ReadonlySet<string> = new Set(['"', "'", "`"]);
const OPENER_CHARS: ReadonlySet<string> = new Set(["(", "[", "{"]);
const CLOSER_CHARS: ReadonlySet<string> = new Set([")", "]", "}"]);

interface ScanState {
    depth: number;
    done: boolean;
    escaped: boolean;
    out: string;
    pendingSpace: boolean;
    quote: string;
}

const appendChar = function appendChar(state: ScanState, ch: string): void {
    if (state.pendingSpace) {
        state.out += " ";
        state.pendingSpace = false;
    }
    state.out += ch;
};

const scanInQuote = function scanInQuote(state: ScanState, ch: string): void {
    state.out += ch;
    if (state.escaped) {
        state.escaped = false;
        return;
    }
    if (ch === "\\") {
        state.escaped = true;
        return;
    }
    if (ch === state.quote) {
        state.quote = "";
    }
};

const depthDelta = function depthDelta(ch: string): number {
    if (OPENER_CHARS.has(ch)) {
        return 1;
    }
    return CLOSER_CHARS.has(ch) ? -1 : 0;
};

const scanChar = function scanChar(state: ScanState, ch: string): void {
    if (state.quote !== "") {
        scanInQuote(state, ch);
        return;
    }
    if (QUOTE_CHARS.has(ch)) {
        appendChar(state, ch);
        state.quote = ch;
        return;
    }
    if (ch === " " || ch === "\t") {
        state.pendingSpace = state.out.length > 0;
        return;
    }
    if (ch === ";" && state.depth === 0) {
        state.done = true;
        return;
    }
    state.depth += depthDelta(ch);
    appendChar(state, ch);
};

export const captureValue = function captureValue(
    lines: readonly string[],
    startIndex: number,
): { endIndex: number; value: string } {
    const eq = (lines[startIndex] ?? "").indexOf("=");
    const state: ScanState = { depth: 0, done: false, escaped: false, out: "", pendingSpace: false, quote: "" };
    for (let li = startIndex; li < lines.length; li += 1) {
        const line = lines[li] ?? "";
        for (let ci = li === startIndex ? eq + 1 : 0; ci < line.length; ci += 1) {
            scanChar(state, line[ci] ?? "");
            if (state.done) {
                return { endIndex: li, value: state.out.trim() };
            }
        }
        state.pendingSpace = state.out.length > 0;
    }
    return { endIndex: lines.length - 1, value: state.out.trim() };
};
