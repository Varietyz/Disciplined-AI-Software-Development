import type { Compression, Span } from "../types/board.types.ts";
import { delimitersIn } from "../analyzers/fence.analyzer.ts";

export const blockOf = function blockOf(source: string, agent: string): Span | null {
    const markers = delimitersIn(source);
    const opens = markers.filter((mark) => mark.open && mark.agent === agent);
    const closes = markers.filter((mark) => !mark.open && mark.agent === agent);

    const [open] = opens;
    const [close] = closes;
    if (opens.length !== 1 || closes.length !== 1 || open === undefined || close === undefined) {
        return null;
    }
    if (open.line >= close.line) {
        return null;
    }

    return { from: open.line, to: close.line };
};

const isBlank = function isBlank(text: string): boolean {
    for (let i = 0; i < text.length; i += 1) {
        const character = text.charAt(i);
        if (character !== " " && character !== "\t" && character !== "\r") {
            return false;
        }
    }
    return true;
};

const EXCERPT = 90;

const LABEL_TERMINATORS: ReadonlySet<string> = new Set([":", " ", ""]);

const labelOffset = function labelOffset(line: string, marker: string): number {
    const indent = line.length - line.trimStart().length;
    const rest = line.slice(indent);

    for (let i = 0; i < marker.length; i += 1) {
        if (rest[i] !== marker[i]) {
            return -1;
        }
    }

    return LABEL_TERMINATORS.has(rest.charAt(marker.length)) ? indent : -1;
};

const EMPTY_FIELD = "—";

const FIELD_WIDTH = 8;

const emptiedField = function emptiedField(head: string, marker: string): string {
    return `${head}${marker}:${" ".repeat(Math.max(1, FIELD_WIDTH - marker.length))}${EMPTY_FIELD}`;
};

export const compressBoard = function compressBoard(source: string, marker: string, schemaField = false): Compression {
    if (marker.length === 0) {
        return { excised: [], fields: 0, removed: 0, text: source };
    }

    const lines = source.split("\n");
    const kept: string[] = [];
    const excised: string[] = [];
    let fields = 0;
    let removed = 0;

    for (const line of lines) {
        const at = labelOffset(line, marker);
        const head = at === -1 ? line : line.slice(0, at);
        const replacement = at !== -1 && schemaField ? emptiedField(head, marker) : head;
        if (at !== -1) {
            fields += 1;
            removed += line.length - replacement.length;
            excised.push(line.slice(at, at + EXCERPT).trim());
        }

        if (at === -1 || schemaField || !isBlank(head)) {
            kept.push(replacement);
        }
    }

    return { excised, fields, removed, text: kept.join("\n") };
};
