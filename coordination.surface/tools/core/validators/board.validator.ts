import { ACTIVE_STATE, seatState } from "../analyzers/board.analyzer.ts";
import {
    AGENT_FIELDS,
    AGENT_LABEL,
    ANSWER_PREFIX,
    BOARD_STATES,
    CLAIM_WORDS,
    GATE_FIELDS,
} from "../constants/board.constants.ts";
import type { BoardRecord, StateDrift } from "../types/board.types.ts";
import type { Finding } from "../types/segment.types.ts";
import { activeLetters } from "../resolvers/board.resolver.ts";
import { boardFinding } from "../factories/board.factory.ts";
import { indexedStates } from "../inspectors/index.inspector.ts";
import { readerSet } from "../inspectors/board.inspector.ts";
import { repeatedSpan } from "../analyzers/marker.analyzer.ts";

export const addressee = function addressee(record: BoardRecord): string {
    const space = record.label.indexOf(" ");
    return space === -1 ? "" : record.label.slice(space + 1);
};

export const peerSet = function peerSet(records: readonly BoardRecord[], index: string): ReadonlySet<string> {
    const stateOf = seatState(index);
    return new Set(
        records
            .filter((record) => record.kind === "agent" && stateOf(addressee(record), record.state) === ACTIVE_STATE)
            .map(addressee),
    );
};

export const checkAnswer = function checkAnswer(
    record: BoardRecord,
    field: string,
    peers: ReadonlySet<string>,
): Finding[] {
    const target = field.slice(ANSWER_PREFIX.length);

    if (target === addressee(record)) {
        return [
            boardFinding(
                "selfAnswer",
                record.line,
                record.label,
                `${record.label} carries ${field}, which addresses itself`,
                `a directed answer field names a peer record, never ${record.label}`,
                "an answer channel exists so one agent can reply inside another's record without disturbing it; addressed at itself it carries nothing a Status line does not already hold",
            ),
        ];
    }

    return peers.has(target)
        ? []
        : [
              boardFinding(
                  "danglingAnswer",
                  record.line,
                  record.label,
                  `${record.label} carries ${field}, and no ${AGENT_LABEL} ${target} record exists`,
                  "a directed answer field names a record present on this board",
                  "a channel addressed at an absent agent is answered by nobody and reads as an outstanding reply; delete the field or raise the record it names",
              ),
          ];
};

export const checkRepetition = function checkRepetition(record: BoardRecord): Finding[] {
    return [...record.fields].flatMap(([field, value]) => {
        const repeat = repeatedSpan(value, CLAIM_WORDS);
        return repeat === null
            ? []
            : [
                  boardFinding(
                      "repeatedClaim",
                      record.line,
                      `${record.label} ${field}`,
                      `${field} states one claim twice: "${repeat}"`,
                      "each claim stated once, or deleted once absorbed",
                      "a record that restates itself is accumulating rather than reporting; a round is written to be read once and then absorbed into a resource, a draft or a rule, and deleted here — detail belongs behind Refs, and the board carries what the other agent must act on rather than what was done",
                  ),
              ];
    });
};

const extraFieldFindings = function extraFieldFindings(
    record: BoardRecord,
    field: string,
    required: readonly string[],
    peers: ReadonlySet<string>,
): Finding[] {
    if (record.kind === "agent" && field.startsWith(ANSWER_PREFIX)) {
        return checkAnswer(record, field, peers);
    }
    return [
        boardFinding(
            "extraField",
            record.line,
            record.label,
            `${record.label} carries ${field}, which the schema does not declare`,
            `${record.label} carries exactly ${required.join(", ")}`,
            "the board holds normalized records rather than prose; detail belongs in memory, a plan or a document reached through Refs",
        ),
    ];
};

const checkFields = function checkFields(record: BoardRecord, peers: ReadonlySet<string>): Finding[] {
    const required = record.kind === "agent" ? AGENT_FIELDS : GATE_FIELDS;

    const missing = required
        .filter((field) => !record.fields.has(field))
        .map((field) =>
            boardFinding(
                "missingField",
                record.line,
                record.label,
                `${record.label} omits ${field}`,
                `${record.label} carries exactly ${required.join(", ")}`,
                "each record carries exactly its fixed schema and nothing else; a removed field reads as absence, so the field is present with an explicit em dash when it has no content",
            ),
        );

    const extra = [...record.fields.keys()]
        .filter((field) => !required.includes(field))
        .flatMap((field) => extraFieldFindings(record, field, required, peers));

    return [...missing, ...extra];
};

const checkState = function checkState(record: BoardRecord): Finding[] {
    const state = record.fields.get("State") ?? "";
    if (record.kind !== "gate" || BOARD_STATES.includes(state)) {
        return [];
    }

    return [
        boardFinding(
            "badState",
            record.line,
            record.label,
            `${record.label} declares State ${state}`,
            BOARD_STATES.join(" | "),
            "a gate state is one of the declared values; PENDING means unevaluated and is never a soft failure, because the board carries no warning tier either",
        ),
    ];
};

export const checkRecord = function checkRecord(record: BoardRecord, peers: ReadonlySet<string>): Finding[] {
    return [...checkFields(record, peers), ...checkRepetition(record), ...checkState(record)];
};

const STATE_SEPARATOR = "—";

export const stateDrift = function stateDrift(records: readonly BoardRecord[], index: string): StateDrift[] {
    const bound = indexedStates(index);
    return records
        .filter((record) => record.kind === "agent")
        .flatMap((record) => {
            const letter = addressee(record);
            const declared = bound.get(letter);
            return declared === undefined || declared === record.state
                ? []
                : [{ bound: declared, letter, line: record.line, marker: record.state }];
        });
};

const healedLine = function healedLine(line: string, bound: string): string {
    const dash = line.indexOf(STATE_SEPARATOR);
    return dash === -1 ? line : `${line.slice(0, dash + STATE_SEPARATOR.length)} ${bound}`;
};

export const healStateDrift = function healStateDrift(source: string, drifts: readonly StateDrift[]): string {
    const boundAt = new Map(drifts.map((drift): [number, string] => [drift.line - 1, drift.bound]));
    return source
        .split("\n")
        .map((line, index) => {
            const bound = boundAt.get(index);
            return bound === undefined ? line : healedLine(line, bound);
        })
        .join("\n");
};

export const checkStateDrift = function checkStateDrift(drifts: readonly StateDrift[]): Finding[] {
    return drifts.map((drift) =>
        boardFinding(
            "derivedStateDrift",
            drift.line,
            `${AGENT_LABEL} ${drift.letter}`,
            `${drift.letter} declares ${drift.marker} here and ${drift.bound} where the binding is allocated`,
            `${drift.letter} carries the state its allocating surface binds`,
            "one fact declared on two surfaces has a precedence that lives only in the resolvers reading it, so the subordinate copy can be arbitrarily wrong while every derivation stays correct and no reader can see which of the two they are looking at — and it degrades to a single operand exactly where the dominant surface binds nothing, which is the case carrying the least evidence. The subordinate copy is DERIVED from the allocation rather than compared against it, which leaves one writer instead of adding a third mechanism to referee two; this heals in place, because a copy nobody may edit — its own writer stopped, and a peer is barred from the record — is otherwise a false value with no reachable repair",
        ),
    );
};

export const checkAddressees = function checkAddressees(source: string, index: string): Finding[] {
    const active = activeLetters(source, index);
    return source.split("\n").flatMap((line, at) =>
        readerSet(line)
            .filter((reader) => !active.has(reader))
            .map((reader) =>
                boardFinding(
                    "danglingAddressee",
                    at + 1,
                    reader,
                    `an item is addressed to ${reader}, which the board does not declare ACTIVE`,
                    "every addressee is an agent with an ACTIVE record",
                    "an item addressed to an agent that is not active has no reader and can never be handled, so it sits forever while reading as live traffic — the same shape as a row bound to an absent agent, which can be built and never retired. The roster is DERIVED: PRESENCE from the board's own records and STATE from the identity index, which is the surface a form maintains in both directions, so a seat departing through that form re-points this check on the next run with nothing to edit",
                ),
            ),
    );
};
