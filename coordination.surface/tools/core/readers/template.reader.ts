import type { TemplateContract } from "../types/template.types.ts";

const GRAPH_MARKER = "graph_4d: {";

const ASSIGN = "SET ";

const SEPARATOR = " = ";

const QUOTE = '"';

const LIST_CLOSE = "]";

const RENDERED_COLUMN = "rendered as";

const MARKER_EDGE = "*";

const quotedItems = function quotedItems(value: string): string[] {
    const parts = value.split(QUOTE);
    const stop = parts.findIndex((part, index) => index % 2 === 0 && part.includes(LIST_CLOSE));
    const bounded = stop === -1 ? parts : parts.slice(0, stop + 1);
    return bounded.flatMap((part, index) => (index % 2 === 1 && index + 1 < bounded.length ? [part] : []));
};

const isNumeric = function isNumeric(char: string): boolean {
    return (char >= "0" && char <= "9") || char === ".";
};

const leadingNumber = function leadingNumber(value: string): number {
    let start = 0;
    while (value.charAt(start) === " ") {
        start += 1;
    }
    let end = start;
    while (end < value.length && isNumeric(value.charAt(end))) {
        end += 1;
    }

    const parsed = Number(value.slice(start, end));
    return Number.isFinite(parsed) ? parsed : 0;
};

const assignmentOf = function assignmentOf(raw: string): [string, string] | null {
    const line = raw.trim();
    const at = line.indexOf(SEPARATOR);
    const name = line.startsWith(ASSIGN) && at !== -1 ? line.slice(ASSIGN.length, at).trim() : "";
    return name.length === 0 ? null : [name, line.slice(at + SEPARATOR.length)];
};

const assignmentsIn = function assignmentsIn(source: string): Map<string, string> {
    const entries = source
        .split("\n")
        .map(assignmentOf)
        .filter((entry): entry is [string, string] => entry !== null);
    return new Map(entries.toReversed());
};

const objectKeys = function objectKeys(source: string, marker: string): string[] {
    const at = source.indexOf(marker);
    if (at === -1) {
        return [];
    }

    const body = source.slice(at + marker.length);
    const close = body.indexOf("}");
    return (close === -1 ? body : body.slice(0, close))
        .split(",")
        .flatMap((part) => part.split(":").slice(0, -1))
        .map((key) => key.trim())
        .filter((key) => key.length > 0);
};

const cellsOf = function cellsOf(line: string): string[] {
    return line.split("|").map((cell) => cell.trim());
};

const unticked = function unticked(cell: string): string {
    let start = 0;
    let end = cell.length;
    while (start < end && cell.charAt(start) === "`") {
        start += 1;
    }
    while (end > start && cell.charAt(end - 1) === "`") {
        end -= 1;
    }
    return cell.slice(start, end);
};

const isRowMarker = function isRowMarker(marker: string): boolean {
    return marker.startsWith(MARKER_EDGE) && marker.endsWith(`:${MARKER_EDGE}`);
};

export const readRowMarkers = function readRowMarkers(source: string): string[] {
    const lines = source.split("\n");
    const header = lines.findIndex((line) => cellsOf(line).includes(RENDERED_COLUMN));
    if (header === -1) {
        return [];
    }

    const column = cellsOf(lines[header] ?? "").indexOf(RENDERED_COLUMN);
    const rows = lines.slice(header + 2).map((line) => line.trim());
    const end = rows.findIndex((line) => !line.startsWith("|"));

    return (end === -1 ? rows : rows.slice(0, end))
        .map((line) => unticked(cellsOf(line)[column] ?? ""))
        .filter(isRowMarker);
};

export const readTemplateContract = function readTemplateContract(source: string): TemplateContract {
    const assignments = assignmentsIn(source);

    return {
        confidenceThreshold: leadingNumber(assignments.get("confidence_threshold") ?? ""),
        dependencyAxes: objectKeys(source, GRAPH_MARKER),
        genesisStages: quotedItems(assignments.get("substrate_cycle") ?? ""),
        rippleDimensions: quotedItems(assignments.get("ripple_dimensions") ?? ""),
    };
};
