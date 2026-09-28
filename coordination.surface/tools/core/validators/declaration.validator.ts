import { fieldOf } from "../readers/json.reader.ts";
import { lifetime } from "../../../config/surface.config.ts";

const DECLARE = "function ";

const OPEN = "(";

const BODY_OPEN = "{";

const BODY_CLOSE = "}";

interface AxisConsumer {
    readonly name: string;
    readonly line: number;
    readonly asserted: string;
    readonly read: readonly string[];
}

const axisNames = function axisNames(): string[] {
    return Object.keys(lifetime.values);
};

const axisValues = function axisValues(axis: string): readonly string[] {
    const values = fieldOf(lifetime.values, axis);
    return Array.isArray(values) ? values.filter((value): value is string => typeof value === "string") : [];
};

const lowered = function lowered(text: string): string {
    let out = "";
    for (const character of text) {
        const code = character.codePointAt(0) ?? 0;
        out += code >= 65 && code <= 90 ? String.fromCharCode(code + 32) : character;
    }
    return out;
};

const STEM = 5;

const assertedAxis = function assertedAxis(name: string): string | null {
    const held = lowered(name);

    for (const axis of axisNames()) {
        const stem = lowered(axis).slice(0, STEM);
        if (stem.length > 0 && held.includes(stem)) {
            return axis;
        }

        for (const value of axisValues(axis)) {
            const word = lowered(value).split("-").join("");
            if (word.length > 0 && held.includes(word)) {
                return axis;
            }
        }
    }

    return null;
};

const QUOTES = new Set(['"', "'", "`"]);

const nextOpen = function nextOpen(open: string, character: string): string {
    if (!QUOTES.has(character)) {
        return open;
    }
    if (open.length === 0) {
        return character;
    }
    return open === character ? "" : open;
};

const quotedAt = function quotedAt(line: string, index: number): boolean {
    let open = "";
    for (let cursor = 0; cursor < index; cursor += 1) {
        open = nextOpen(open, line.charAt(cursor));
    }
    return open.length > 0;
};

const declaredNameAt = function declaredNameAt(line: string): string | null {
    const at = line.indexOf(DECLARE);
    if (at === -1) {
        return null;
    }
    if (quotedAt(line, at)) {
        return null;
    }

    const rest = line.slice(at + DECLARE.length);
    const open = rest.indexOf(OPEN);
    if (open <= 0) {
        return null;
    }

    const name = rest.slice(0, open).trim();
    return name.length === 0 || name.includes(" ") ? null : name;
};

const bodyOf = function bodyOf(lines: readonly string[], from: number): string {
    let depth = 0;
    let seen = false;
    let out = "";

    for (let index = from; index < lines.length; index += 1) {
        const line = lines[index] ?? "";
        out += `${line}\n`;

        for (const character of line) {
            if (character === BODY_OPEN) {
                depth += 1;
                seen = true;
            }
            if (character === BODY_CLOSE) {
                depth -= 1;
            }
        }

        if (seen && depth <= 0) {
            return out;
        }
    }

    return out;
};

const consumerAt = function consumerAt(
    lines: readonly string[],
    index: number,
    reaches: readonly string[],
): AxisConsumer[] {
    const name = declaredNameAt(lines[index] ?? "");
    const asserted = name === null ? null : assertedAxis(name);
    if (name === null || asserted === null) {
        return [];
    }

    const body = bodyOf(lines, index);
    if (!reaches.some((token) => body.includes(token))) {
        return [];
    }

    return [{ asserted, line: index + 1, name, read: axisNames().filter((axis) => body.includes(`.${axis}`)) }];
};

export const axisConsumers = function axisConsumers(source: string, reaches: readonly string[]): AxisConsumer[] {
    const lines = source.split("\n");
    return [...lines.keys()].flatMap((index) => consumerAt(lines, index, reaches));
};

export const silentOnItsOwnAxis = function silentOnItsOwnAxis(consumer: AxisConsumer): boolean {
    return !consumer.read.includes(consumer.asserted);
};
