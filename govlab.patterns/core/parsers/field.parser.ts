const FLOAT_MARKERS: ReadonlySet<string> = new Set([".", "e", "E"]);
const DIGITS: readonly string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const NUMBER_START: ReadonlySet<string> = new Set(["-", ...DIGITS]);
const NUMBER_BODY: ReadonlySet<string> = new Set(["-", "+", ".", "e", "E", ...DIGITS]);
const WHITESPACE: ReadonlySet<string> = new Set([" ", "\t", "\r", "\n"]);
const STRUCTURE_OPEN: ReadonlySet<string> = new Set(["{", "["]);
const STRUCTURE_CLOSE: ReadonlySet<string> = new Set(["}", "]"]);
const KEY_SEPARATOR = ":";
const ITEM_SEPARATOR = ",";
const QUOTE = '"';
const ESCAPE = "\\";
const ESCAPE_SKIP = 2;

interface StringSpan {
    value: string;
    next: number;
}

interface LineState {
    depth: number;
    pendingKey: string | null;
    expectValue: boolean;
}

interface ScanContext {
    state: LineState;
    floats: Set<string>;
    recordDepth: number;
}

export const numberTokenIsFloat = function numberTokenIsFloat(token: string): boolean {
    for (const symbol of token) {
        if (FLOAT_MARKERS.has(symbol)) {
            return true;
        }
    }
    return false;
};

const appendChar = function appendChar(line: string, index: number, value: string): StringSpan {
    if (line[index] === ESCAPE) {
        return { next: index + ESCAPE_SKIP, value: value + (line[index + 1] ?? "") };
    }
    return { next: index + 1, value: value + (line[index] ?? "") };
};

const readString = function readString(line: string, start: number): StringSpan {
    let index = start + 1;
    let value = "";
    while (index < line.length && line[index] !== QUOTE) {
        ({ next: index, value } = appendChar(line, index, value));
    }
    return { next: index < line.length ? index + 1 : index, value };
};

const readNumber = function readNumber(line: string, start: number): StringSpan {
    let index = start;
    while (index < line.length && NUMBER_BODY.has(line[index] ?? "")) {
        index += 1;
    }
    return { next: index, value: line.slice(start, index) };
};

const handleNumber = function handleNumber(line: string, index: number, context: ScanContext): number {
    const { state, floats, recordDepth } = context;
    const { value, next } = readNumber(line, index);
    if (state.depth === recordDepth && state.pendingKey !== null && numberTokenIsFloat(value)) {
        floats.add(state.pendingKey);
    }
    state.expectValue = false;
    state.pendingKey = null;
    return next;
};

const handleString = function handleString(line: string, index: number, state: LineState): number {
    const { value, next } = readString(line, index);
    if (state.expectValue) {
        state.expectValue = false;
        state.pendingKey = null;
    } else {
        state.pendingKey = value;
    }
    return next;
};

const stepStructural = function stepStructural(symbol: string, state: LineState, index: number): number {
    if (symbol === KEY_SEPARATOR) {
        state.expectValue = true;
        return index + 1;
    }
    if (STRUCTURE_OPEN.has(symbol)) {
        state.depth += 1;
        state.expectValue = false;
        return index + 1;
    }
    if (STRUCTURE_CLOSE.has(symbol)) {
        state.depth -= 1;
        return index + 1;
    }
    if (symbol === ITEM_SEPARATOR) {
        state.pendingKey = null;
    }
    if (!WHITESPACE.has(symbol)) {
        state.expectValue = false;
    }
    return index + 1;
};

const stepScan = function stepScan(text: string, index: number, context: ScanContext): number {
    const symbol = text[index] ?? "";
    if (symbol === QUOTE) {
        return handleString(text, index, context.state);
    }
    if (context.state.expectValue && NUMBER_START.has(symbol)) {
        return handleNumber(text, index, context);
    }
    return stepStructural(symbol, context.state, index);
};

export const scanFloatFields = function scanFloatFields(text: string, recordDepth: number): Set<string> {
    const floats = new Set<string>();
    const context: ScanContext = { floats, recordDepth, state: { depth: 0, expectValue: false, pendingKey: null } };
    let index = 0;
    while (index < text.length) {
        index = stepScan(text, index, context);
    }
    return floats;
};
