import {
    CARRIAGE_RETURN,
    GAP_CHARS,
    MESSAGE_JOIN,
    MIN_FINDING_PARTS,
    MIN_GAP,
    POSITION_SEPARATOR,
    SGR_BODY,
    SGR_END,
    SGR_OPEN,
    SOURCE_EXTENSIONS,
} from "#configuration/constants/violation.constants";
import type { ParsedOutput, StepOutput, Violation, ViolationsArtifact } from "#types/report.types";
import { ROOT } from "@ssot/paths";

const ROOT_POSIX = ROOT.split("\\").join("/");

const sgrEnd = function sgrEnd(text: string, at: number): number {
    let scan = at + SGR_OPEN.length;
    while (scan < text.length && SGR_BODY.has(text.charAt(scan))) {
        scan += 1;
    }
    return text.charAt(scan) === SGR_END ? scan + 1 : -1;
};

export const stripAnsi = function stripAnsi(text: string): string {
    let out = "";
    let at = 0;
    while (at < text.length) {
        const end = text.startsWith(SGR_OPEN, at) ? sgrEnd(text, at) : -1;
        out += end === -1 ? text.charAt(at) : "";
        at = end === -1 ? at + 1 : end;
    }
    return out;
};

export const withoutTrailingReturn = function withoutTrailingReturn(text: string): string {
    return text.endsWith(CARRIAGE_RETURN) ? text.slice(0, -1) : text;
};

const gapEnd = function gapEnd(text: string, at: number): number {
    let scan = at;
    while (scan < text.length && GAP_CHARS.has(text.charAt(scan))) {
        scan += 1;
    }
    return scan;
};

export const splitOnGaps = function splitOnGaps(text: string): string[] {
    const parts: string[] = [];
    let start = 0;
    let at = 0;
    while (at < text.length) {
        const end = GAP_CHARS.has(text.charAt(at)) ? gapEnd(text, at) : at + 1;
        if (end - at >= MIN_GAP) {
            parts.push(text.slice(start, at));
            start = end;
        }
        at = end;
    }
    parts.push(text.slice(start));
    return parts.filter((part) => part.length > 0);
};

const fileHeaderOf = function fileHeaderOf(line: string): string | null {
    if (line.length === 0 || line.startsWith(" ") || line.includes(MESSAGE_JOIN)) {
        return null;
    }
    const posix = line.trim().split("\\").join("/");
    if (!SOURCE_EXTENSIONS.some((ext) => posix.endsWith(ext))) {
        return null;
    }
    return posix.startsWith(`${ROOT_POSIX}/`) ? posix.slice(ROOT_POSIX.length + 1) : posix;
};

const numberOr = function numberOr(value: string | undefined): number | null {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const findingOf = function findingOf(line: string, step: string): Violation | null {
    const parts = line.startsWith(" ") ? splitOnGaps(line.trim()) : [];
    if (parts.length < MIN_FINDING_PARTS) {
        return null;
    }
    const [position = "", severity = "", ...rest] = parts;
    const [lineText, columnText] = position.split(POSITION_SEPARATOR);
    const lineNumber = numberOr(lineText);
    if (lineNumber === null) {
        return null;
    }
    const rule = rest.length > 1 ? (rest.at(-1) ?? "") : "";
    const message = (rest.length > 1 ? rest.slice(0, -1) : rest).join(MESSAGE_JOIN);
    return { column: numberOr(columnText), line: lineNumber, message, rule, severity, step };
};

export const parseViolations = function parseViolations(output: string, step: string): ParsedOutput {
    const files = new Map<string, Violation[]>();
    let current: string | null = null;
    for (const raw of output.split("\n")) {
        const line = withoutTrailingReturn(stripAnsi(raw));
        const header = fileHeaderOf(line);
        const finding = header === null && current !== null ? findingOf(line, step) : null;
        current = header ?? current;
        if (finding !== null && current !== null) {
            files.set(current, [...(files.get(current) ?? []), finding]);
        }
    }
    return { files, matched: files.size > 0 };
};

export const buildViolations = function buildViolations(
    outputs: readonly StepOutput[],
    label: string,
    stoppedAt: string | null,
    generatedAt: string,
): ViolationsArtifact {
    const files = new Map<string, Violation[]>();
    const unparsed: Record<string, string> = {};
    for (const output of outputs.filter((entry) => !entry.ok)) {
        const parsed = parseViolations(output.out, output.label);
        for (const [file, found] of parsed.files) {
            files.set(file, [...(files.get(file) ?? []), ...found]);
        }
        if (!parsed.matched) {
            unparsed[output.label] = output.out.trim();
        }
    }
    const sorted = [...files.entries()].toSorted((a, b) => a[0].localeCompare(b[0]));
    return {
        files: Object.fromEntries(sorted),
        generatedAt,
        label,
        stoppedAt,
        totals: { files: sorted.length, violations: sorted.reduce((sum, [, found]) => sum + found.length, 0) },
        unparsed,
    };
};
