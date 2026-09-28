import type { IdBreach } from "../types/checklist.types.ts";
import { TASK_MARKER } from "../constants/checklist.constants.ts";

export const isDigit = function isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
};

const idAt = function idAt(line: string, from: number): string | null {
    let cursor = from;
    let parts = 0;
    let digits = 0;

    while (cursor < line.length) {
        const char = line.charAt(cursor);
        const separates = char === "." && digits > 0 && isDigit(line.charAt(cursor + 1));
        if (!isDigit(char) && !separates) {
            break;
        }

        parts += separates ? 1 : 0;
        digits = separates ? 0 : digits + 1;
        cursor += 1;
    }

    return digits === 0 || parts !== 2 ? null : line.slice(from, cursor);
};

export const declaredId = function declaredId(line: string): string | null {
    const trimmed = line.trimStart();
    if (!trimmed.startsWith(TASK_MARKER)) {
        return null;
    }

    let cursor = TASK_MARKER.length;
    while (cursor < trimmed.length && trimmed.charAt(cursor) === " ") {
        cursor += 1;
    }

    return idAt(trimmed, cursor);
};

export const citedIds = function citedIds(line: string): string[] {
    const out: string[] = [];

    for (let index = 0; index < line.length; index += 1) {
        const previous = index > 0 ? line.charAt(index - 1) : "";
        const starts = isDigit(line.charAt(index)) && !isDigit(previous) && previous !== ".";
        const id = starts ? idAt(line, index) : null;
        if (id !== null) {
            out.push(id);
        }
    }

    return out;
};

const BINDING_FIELDS = ["verifier", "owner"];

const boundAgent = function boundAgent(line: string, field: string): string | null {
    const marker = `*${field}:*`;
    const at = line.indexOf(marker);
    if (at === -1) {
        return null;
    }

    let cursor = at + marker.length;
    while (cursor < line.length && line.charAt(cursor) === " ") {
        cursor += 1;
    }

    const letter = line.charAt(cursor);
    if (letter < "A" || letter > "Z") {
        return null;
    }

    const after = line.charAt(cursor + 1);
    if (after !== "" && after !== " " && after !== "\r") {
        return null;
    }

    return letter;
};

export const agentBreaches = function agentBreaches(lines: readonly string[], active: ReadonlySet<string>): IdBreach[] {
    const out: IdBreach[] = [];

    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index] ?? "";

        for (const field of BINDING_FIELDS) {
            const letter = boundAgent(line, field);
            if (letter === null || active.has(letter)) {
                continue;
            }

            const names = `the ${field} names agent ${letter}, and no active record declares it`;
            const resolves = `a ${field} resolves to an agent the board declares ACTIVE`;
            out.push({
                actual: names,
                expected: resolves,
                id: `${field}:${letter}`,
                kind: "danglingBinding",
                line: index + 1,
            });
        }
    }

    return out;
};

const CLOSES_FIELD = "CLOSES:";

const phaseOf = function phaseOf(id: string): number {
    const dot = id.indexOf(".");
    return dot === -1 ? Number.NaN : Number(id.slice(0, dot));
};

export const closureBreaches = function closureBreaches(lines: readonly string[]): IdBreach[] {
    let closes = "";
    let declaredAt = 0;
    const open: { id: string; line: number }[] = [];

    for (let index = 0; index < lines.length; index += 1) {
        const trimmed = (lines[index] ?? "").trim();

        if (trimmed.startsWith(CLOSES_FIELD)) {
            closes = trimmed.slice(CLOSES_FIELD.length).trim();
            declaredAt = index + 1;
            continue;
        }

        const id = declaredId(lines[index] ?? "");
        if (id !== null) {
            open.push({ id, line: index + 1 });
        }
    }

    if (closes.length === 0) {
        return [];
    }

    const closurePhase = phaseOf(closes);
    if (Number.isNaN(closurePhase)) {
        return [];
    }

    const later = open.filter((task) => {
        const phase = phaseOf(task.id);
        return task.id !== closes && !Number.isNaN(phase) && phase > closurePhase;
    });

    if (later.length === 0) {
        return [];
    }

    return [
        {
            actual: `the closure row ${closes} sits in phase ${String(closurePhase)} and these open rows sit later: ${later
                .map((task) => `${task.id} at line ${String(task.line)}`)
                .join(", ")}`,
            expected: `every open row sits at or before the phase of the closure row ${closes}`,
            id: closes,
            kind: "closureBeforeItsDependencies",
            line: declaredAt,
        },
    ];
};

const danglingBreaches = function danglingBreaches(
    lines: readonly string[],
    declared: ReadonlyMap<string, number>,
): IdBreach[] {
    return [...lines.entries()]
        .filter(([, line]) => declaredId(line) === null)
        .flatMap(([index, line]) =>
            citedIds(line)
                .filter((id) => !declared.has(id))
                .map((id) => ({
                    actual: `${id} is cited and no task declares it`,
                    expected: "a cited id resolves to a declared task",
                    id,
                    kind: "danglingReference",
                    line: index + 1,
                })),
        );
};

export const idBreaches = function idBreaches(lines: readonly string[]): IdBreach[] {
    const out: IdBreach[] = [];
    const declared = new Map<string, number>();

    for (const [index, line] of lines.entries()) {
        const id = declaredId(line);
        const first = id === null ? undefined : declared.get(id);
        if (id !== null && first === undefined) {
            declared.set(id, index + 1);
        }

        if (id !== null && first !== undefined) {
            const twice = `${id} is declared at line ${String(first)} and again here`;
            out.push({ actual: twice, expected: "one task per id", id, kind: "duplicateId", line: index + 1 });
        }
    }

    return [...out, ...danglingBreaches(lines, declared)];
};
