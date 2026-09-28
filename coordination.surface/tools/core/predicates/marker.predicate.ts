import type { ForgedBoundary } from "../types/marker.types.ts";

const FENCE_MARK = "`";

const FENCE_MINIMUM = 3;

const SPAN_OPEN = "┌";

const SPAN_CLOSE = "└";

export const isClassHeading = function isClassHeading(heading: string): boolean {
    if (heading.length === 0) {
        return false;
    }

    for (const char of heading) {
        const lower = char >= "a" && char <= "z";
        const digit = char >= "0" && char <= "9";
        if (!lower && !digit && char !== "-") {
            return false;
        }
    }

    return true;
};

const opensAFence = function opensAFence(text: string): boolean {
    let run = 0;
    while (run < text.length && text.charAt(run) === FENCE_MARK) {
        run += 1;
    }

    return run >= FENCE_MINIMUM;
};

const opensASpan = function opensASpan(text: string): boolean {
    return text.startsWith(SPAN_OPEN) || text.startsWith(SPAN_CLOSE);
};

export const forgedBoundaries = function forgedBoundaries(body: string): ForgedBoundary[] {
    const out: ForgedBoundary[] = [];
    const lines = body.split("\n");

    for (let index = 0; index < lines.length; index += 1) {
        const text = (lines[index] ?? "").trimStart();
        if (!opensAFence(text) && !opensASpan(text)) {
            continue;
        }

        out.push({ line: index + 1, text: text.slice(0, 40) });
    }

    return out;
};
