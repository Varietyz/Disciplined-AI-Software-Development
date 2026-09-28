import {
    INDEX_CONTENDED,
    LETTERS_EXHAUSTED,
    ROLE_MISSING,
    ROW_SECTION_MISSING,
    alreadyInState,
    foreignWithoutReason,
    malformedRow,
    rowAdded,
    stateChanged,
    unboundLetter,
    unknownState,
} from "../strings/index.strings.ts";

import { readFileSync, writeFileSync } from "node:fs";
import { indexedLetters } from "../inspectors/index.inspector.ts";

const ROW = "| ";

const SECTION = "═";

const SECTION_WORD = "INDEX";

const ACTIVE_STATE = "ACTIVE";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const LOWER = "abcdefghijklmnopqrstuvwxyz";

export const SEAT_STATES: readonly string[] = ["ACTIVE", "INACTIVE", "INVOKED"];

interface TransitionRequest {
    readonly absolute: string;
    readonly letter: string;
    readonly state: string;
    readonly by: string;
    readonly warrant: string | null;
}

const refused = function refused(message: string): IndexOutcome {
    return { code: 2, message };
};

const rowLetter = function rowLetter(line: string): string {
    const cells = line.split("|");
    return (cells[1] ?? "").trim();
};

const transitionRefusal = function transitionRefusal(request: TransitionRequest, foreign: boolean): string | null {
    const unwarranted = request.warrant === null || request.warrant.trim().length === 0;
    if (foreign && unwarranted) {
        return foreignWithoutReason(request.by, request.letter);
    }

    return SEAT_STATES.includes(request.state) ? null : unknownState(request.state, SEAT_STATES);
};

const warrantLine = function warrantLine(request: TransitionRequest): string {
    return `> ${request.letter} moved to ${request.state} by ${request.by} under ${String(request.warrant)}`;
};

export const runTransition = function runTransition(request: TransitionRequest): IndexOutcome {
    const foreign = request.letter !== request.by;
    const refusal = transitionRefusal(request, foreign);
    if (refusal !== null) {
        return refused(refusal);
    }

    const source = readFileSync(request.absolute, "utf8");
    const lines = source.split("\n");

    const at = lines.findIndex((line) => line.startsWith(ROW) && rowLetter(line) === request.letter);
    if (at === -1) {
        return refused(unboundLetter(request.letter));
    }

    const cells = (lines[at] ?? "").split("|");
    if (cells.length < 5) {
        return refused(malformedRow(request.letter));
    }

    const current = (cells[3] ?? "").trim();
    if (current === request.state) {
        return { code: 0, message: alreadyInState(request.letter, request.state) };
    }

    cells[3] = ` ${request.state} `;
    lines[at] = cells.join("|");
    lines.splice(at + 1, 0, ...(foreign ? [warrantLine(request)] : []));

    const witness = readFileSync(request.absolute, "utf8");
    if (witness !== source) {
        return refused(INDEX_CONTENDED);
    }

    writeFileSync(request.absolute, lines.join("\n"), "utf8");

    return { code: 0, message: stateChanged(request.letter, request.state, foreign ? request.by : null) };
};

interface IndexRequest {
    readonly absolute: string;
    readonly role: string;
}

interface IndexOutcome {
    readonly code: number;
    readonly message: string;
}

const candidates = function candidates(): string[] {
    const out: string[] = [];

    for (const first of UPPER) {
        out.push(first);
    }
    for (const first of UPPER) {
        for (const second of LOWER) {
            out.push(`${first}${second}`);
        }
    }
    for (const first of UPPER) {
        for (const second of UPPER) {
            for (const third of LOWER) {
                out.push(`${first}${second}${third}`);
            }
        }
    }

    return out;
};

const shortestFree = function shortestFree(taken: ReadonlySet<string>): string | null {
    for (const candidate of candidates()) {
        if (!taken.has(candidate)) {
            return candidate;
        }
    }

    return null;
};

const lastRowIn = function lastRowIn(lines: readonly string[]): number {
    const opened = lines.findIndex((line) => {
        const trimmed = line.trim();
        return trimmed.startsWith(SECTION) && trimmed.includes(SECTION_WORD);
    });
    if (opened === -1) {
        return -1;
    }

    const rest = lines.slice(opened + 1);
    const closes = rest.findIndex((line) => line.trim().startsWith(SECTION));
    const last = (closes === -1 ? rest : rest.slice(0, closes)).findLastIndex((line) => line.startsWith(ROW));
    return last === -1 ? -1 : opened + 1 + last;
};

export const runIndex = function runIndex(request: IndexRequest): IndexOutcome {
    const role = request.role.trim();
    if (role.length === 0) {
        return refused(ROLE_MISSING);
    }

    const source = readFileSync(request.absolute, "utf8");
    const lines = source.split("\n");

    const at = lastRowIn(lines);
    if (at === -1) {
        return refused(ROW_SECTION_MISSING);
    }

    const letter = shortestFree(indexedLetters(source).letters);
    if (letter === null) {
        return refused(LETTERS_EXHAUSTED);
    }

    const written = [...lines.slice(0, at + 1), `| ${letter} | ${role} | ${ACTIVE_STATE} |`, ...lines.slice(at + 1)];

    const witness = readFileSync(request.absolute, "utf8");
    if (witness !== source) {
        return refused(INDEX_CONTENDED);
    }

    writeFileSync(request.absolute, written.join("\n"), "utf8");

    return { code: 0, message: rowAdded(letter, role) };
};
