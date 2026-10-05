const LINE_FEED = "\n";
const CARRIAGE_RETURN = "\r";

const withoutReturn = function withoutReturn(line: string): string {
    return line.endsWith(CARRIAGE_RETURN) ? line.slice(0, -1) : line;
};

export const splitLines = function splitLines(text: string): string[] {
    return text.split(LINE_FEED).map(withoutReturn);
};

export const valueAfter = function valueAfter(trimmed: string, prefix: string): string {
    return trimmed.slice(prefix.length).trim();
};
