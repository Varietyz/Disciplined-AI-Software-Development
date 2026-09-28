import { isWordCharacter } from "../predicates/token.predicate.ts";

const CONTEXT_CAP = 400;

const KEY_FILLER = "-";

const isAlphanumeric = function isAlphanumeric(char: string): boolean {
    return char !== "_" && isWordCharacter(char);
};

export const safeKey = function safeKey(text: string): string {
    let out = "";
    for (const char of text) {
        out += isAlphanumeric(char) ? char : KEY_FILLER;
    }
    return out;
};

export const clipped = function clipped(value: string, limit: number): string {
    return value.length > limit ? `${value.slice(0, limit)}…` : value;
};

export const appendSection = function appendSection(before: string, heading: string, body: string): string {
    const terminated = before.endsWith("\n") ? before : `${before}\n`;
    return `${terminated}\n${heading}\n\n${body}\n`;
};

const counted = function counted(lines: readonly string[]): Map<string, number> {
    const out = new Map<string, number>();
    for (const line of lines) {
        out.set(line, (out.get(line) ?? 0) + 1);
    }
    return out;
};

interface Surplus {
    readonly lines: readonly string[];
    readonly remaining: ReadonlyMap<string, number>;
}

const surplus = function surplus(
    lines: readonly string[],
    own: ReadonlyMap<string, number>,
    other: ReadonlyMap<string, number>,
): Surplus {
    const remaining = new Map(own);
    const out: string[] = [];
    for (const line of lines) {
        const spare = remaining.get(line) ?? 0;
        if (line.trim().length > 0 && (other.get(line) ?? 0) < spare) {
            remaining.set(line, spare - 1);
            out.push(line);
        }
    }
    return { lines: out, remaining };
};

const capped = function capped(mark: string): (line: string) => string {
    return (line: string): string => `${mark} ${line.trim().slice(0, CONTEXT_CAP)}`;
};

export const diffLines = function diffLines(before: string, after: string): string[] {
    const was = before.split("\n");
    const now = after.split("\n");
    const heldBefore = counted(was);

    const added = surplus(now, counted(now), heldBefore);
    const removed = surplus(was, heldBefore, added.remaining);

    return [...removed.lines.map(capped("-")), ...added.lines.map(capped("+"))];
};
