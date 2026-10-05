const HEX_RADIX = 16;

export const HARDENING_DETAILS = {
    direction: "`direction` statement — omit it (subgraph direction is unsupported in older renderers)",
    htmlBreak: "<br> in a label — keep the label on one line (no HTML line breaks)",
    semicolon: "';' is a statement separator (breaks unquoted sequence messages) — use a comma or period",
} as const;

export const nonAsciiDetail = function nonAsciiDetail(code: number): string {
    return `non-ASCII character U+${code.toString(HEX_RADIX).toUpperCase()} — use plain ASCII (no em-dash, middot, arrows, math symbols, or checkmarks)`;
};

export const parenDetail = function parenDetail(char: string): string {
    return `'${char}' — no parentheses (no rounded/stadium/cylinder shapes, no parenthetical label text)`;
};

export const reservedDetail = function reservedDetail(char: string): string {
    return `'${char}' inside a label — remove brackets, angle brackets, and entities from label text`;
};

export const hardeningAbort = function hardeningAbort(path: string, details: string): string {
    return `${path} failed hardening — generation aborted (not written):\n${details}`;
};

export const hardeningLine = function hardeningLine(line: number, code: string, detail: string): string {
    return `  line ${line}: [${code}] ${detail}`;
};

export const hardeningMessage = function hardeningMessage(code: string, detail: string): string {
    return `[${code}] ${detail}`;
};

export const parserUnavailable = function parserUnavailable(reason: string): string {
    return `govlab.docs: mermaid grammar validation unavailable (${reason}) — hardening rule still enforced`;
};
