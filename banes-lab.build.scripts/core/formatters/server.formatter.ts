import type { Prefixed } from "#types/server.types";

const LINE_END = "\n";

export const prefixLines = function prefixLines(label: string, carry: string, chunk: string): Prefixed {
    const parts = (carry + chunk).split(LINE_END);
    const rest = parts.pop() ?? "";
    return { carry: rest, lines: parts.map((line) => `[${label}] ${line}${LINE_END}`) };
};
