import { AGENT_FIELDS, GATE_FIELDS, READ_BUDGET_CHARS, STALE_MARKERS } from "../constants/board.constants.ts";
import type { BoardRecord } from "../types/board.types.ts";
import type { Finding } from "../types/segment.types.ts";
import { boardFinding } from "../factories/board.factory.ts";
import { carriesMarker } from "../analyzers/marker.analyzer.ts";
import { indexedLetters } from "./index.inspector.ts";
import { readBoardContract } from "../readers/board.reader.ts";
import { unresolvedAddressing } from "../analyzers/board.analyzer.ts";

const ADDRESS_PREFIX = "To ";

const ADDRESS_TERMINATOR = "—";

const EVERYONE = "ALL";

const ROLE_PREFIX = "WHOEVER";

const EXCERPT = 40;

export const readerSet = function readerSet(line: string): string[] {
    const trimmed = line.trim();
    if (!trimmed.startsWith(ADDRESS_PREFIX)) {
        return [];
    }

    const end = trimmed.indexOf(ADDRESS_TERMINATOR);
    if (end === -1) {
        return [];
    }

    const body = trimmed.slice(ADDRESS_PREFIX.length, end);
    if (body.includes(ROLE_PREFIX) || body.includes(EVERYONE)) {
        return [];
    }

    const out = new Set<string>();
    for (const part of body.split(",")) {
        for (const word of part.split(" ")) {
            const name = word.trim();
            if (name.length !== 1 || name < "A" || name > "Z") {
                continue;
            }
            out.add(name);
        }
    }

    return [...out];
};

export const letterOfLabel = function letterOfLabel(label: string): string {
    const space = label.indexOf(" ");
    return space === -1 ? label : label.slice(space + 1);
};

export const checkIndex = function checkIndex(
    records: readonly { kind: string; label: string; line: number }[],
    index: string,
): Finding[] {
    const { letters, duplicates } = indexedLetters(index);

    const duplicated = duplicates.map((letter) =>
        boardFinding(
            "duplicateIndexBinding",
            1,
            letter,
            `the index binds ${letter} more than once`,
            `${letter} bound to exactly one role`,
            "a letter is bound to a role for the life of the project and is never reused, because every item, row, citation and changelog line that ever named it resolves through the index — two bindings silently re-point half of them, and nothing errors",
        ),
    );

    const unindexed = records
        .filter((record) => record.kind === "agent" && !letters.has(letterOfLabel(record.label)))
        .map((record) =>
            boardFinding(
                "unindexedAgent",
                record.line,
                letterOfLabel(record.label),
                `${record.label} writes under a letter the index does not bind`,
                `${letterOfLabel(record.label)} carrying an index row before its first write`,
                "a letter is claimed by adding the index row, never by using it. Writing under an unindexed letter is the same construct as a task citing an agent the board does not declare — it reads as governed and resolves to nothing, and every citation written against it resolves to nothing too",
            ),
        );

    return [...duplicated, ...unindexed];
};

const drift = function drift(declared: readonly string[], derived: readonly string[], kind: string): Finding[] {
    const held = new Set(derived);
    const missing = declared.filter((field) => !held.has(field));
    const extra = derived.filter((field) => !declared.includes(field));

    if (missing.length === 0 && extra.length === 0) {
        return [];
    }

    return [
        boardFinding(
            "templateDrift",
            1,
            kind,
            `the comms template declares ${derived.join(", ")} for a ${kind} record`,
            declared.join(", "),
            "the template is what a new board is built FROM, so a schema transcribed in the gate and restated in the template is two copies of one contract with nothing keeping them equal — and the drift surfaces only when somebody raises a board and it fails on its first run. The checklist gate already derives its contract from its own template for exactly this reason; a board raised from a drifted template is non-conformant at birth",
        ),
    ];
};

export const checkTemplateDrift = function checkTemplateDrift(template: string): Finding[] {
    const contract = readBoardContract(template);
    return [
        ...(contract.agentFields.length > 0 ? drift(AGENT_FIELDS, contract.agentFields, "agent") : []),
        ...(contract.gateFields.length > 0 ? drift(GATE_FIELDS, contract.gateFields, "gate") : []),
    ];
};

export const checkReadable = function checkReadable(source: string): Finding[] {
    return source
        .split("\n")
        .flatMap((line, index) =>
            line.length <= READ_BUDGET_CHARS
                ? []
                : [
                      boardFinding(
                          "unreadableField",
                          index + 1,
                          line.slice(0, EXCERPT),
                          `one field carries ${String(line.length)} characters, past what a single read can consume`,
                          `no field longer than ${String(READ_BUDGET_CHARS)} characters`,
                          "the board is read whole before any agent acts, and an oversized board is read in parts until it is whole — but a part is never smaller than one field, so a field past the read budget removes the last granularity the protocol has left and makes reading it whole impossible rather than merely expensive; the rule that every other board rule depends on then stops holding while every one of them still reports green",
                      ),
                  ],
        );
};

export const checkItemAddressing = function checkItemAddressing(source: string): Finding[] {
    return unresolvedAddressing(source).map((site) =>
        boardFinding(
            "unresolvedAddressing",
            site.line,
            site.opener,
            "an item names an addressee in its text while its metadata resolved to everyone",
            "the metadata carries the letters the text names",
            "the sweep closes an item once every ADDRESSEE has posted later than it, so an item whose addressing failed to parse is addressed to everyone and is swept by nobody — it accumulates while looking correctly filed. The failure is silent in the direction that costs most: the writer sees their item land, the reader still receives it, and only the automatic drain quietly stops applying. A parser that rejects the punctuation every writer actually uses degrades to broadcast rather than erroring, which is why the construct is checked on the surface instead of trusted at the tool",
        ),
    );
};

const fieldCounts = function fieldCounts(lines: readonly string[], required: readonly string[]): Map<string, number> {
    const seen = new Map<string, number>();
    for (const line of lines) {
        const field = required.find((each) => line.startsWith(`  ${each}:`));
        if (field !== undefined) {
            seen.set(field, (seen.get(field) ?? 0) + 1);
        }
    }
    return seen;
};

export const checkDuplicateFields = function checkDuplicateFields(
    source: string,
    records: readonly BoardRecord[],
): Finding[] {
    const lines = source.split("\n");

    return records.flatMap((record, index) => {
        const required = record.kind === "agent" ? AGENT_FIELDS : GATE_FIELDS;
        const end = records[index + 1]?.line ?? lines.length + 1;

        return [...fieldCounts(lines.slice(record.line, end - 1), required)]
            .filter(([, count]) => count > 1)
            .map(([field, count]) =>
                boardFinding(
                    "duplicateField",
                    record.line,
                    record.label,
                    `${record.label} declares ${field} ${String(count)} times`,
                    `${record.label} declares ${field} once`,
                    "a record carries exactly its fixed schema, and a field parsed into a map collapses its duplicates into one entry — so a second declaration of the same field is invisible to every check that reads the parsed record, while a reader sees two fields disagreeing about one thing",
                ),
            );
    });
};

const leadingValue = function leadingValue(line: string): string {
    const colon = line.indexOf(":");
    const value = colon === -1 ? line.trim() : line.slice(colon + 1).trim();
    return value.split(" ")[0] ?? "";
};

export const checkMarkers = function checkMarkers(source: string): Finding[] {
    return source.split("\n").flatMap((line, index) => {
        const first = leadingValue(line);

        return STALE_MARKERS.filter((marker) => first === marker && carriesMarker(line, marker)).map((marker) =>
            boardFinding(
                "staleMarker",
                index + 1,
                marker,
                `the board carries the marker ${marker}`,
                "current truth only",
                "the board is overwritten in place; a resolved flag or completed unit is deleted outright, because a stale record manufactures a false belief in every agent that reads it",
            ),
        );
    });
};
