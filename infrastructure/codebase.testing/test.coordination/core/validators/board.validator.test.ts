import { AGENT_FIELDS, ANSWER_PREFIX, CLAIM_WORDS } from "coordination-surface/tools/core/constants/board.constants.ts";
import {
    addressee,
    checkAddressees,
    checkAnswer,
    checkRecord,
    checkRepetition,
    checkStateDrift,
    healStateDrift,
    peerSet,
    stateDrift,
} from "coordination-surface/tools/core/validators/board.validator.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { boardRecords } from "coordination-surface/tools/core/analyzers/board.analyzer.ts";

const fields = function fields(indent = "  "): string[] {
    return AGENT_FIELDS.map((field) => `${indent}${field}: —`);
};

const BOARD = [
    "Agent A — ACTIVE",
    ...fields(),
    "Agent B — ACTIVE",
    ...fields(),
    "Agent C — INACTIVE",
    ...fields(),
    "Gate converge — open",
    "  State: MAYBE",
    "  Owner: A",
].join("\n");

type BoardRecord = ReturnType<typeof boardRecords>[number];

const present = function present(record: BoardRecord | undefined): BoardRecord {
    assert.ok(record !== undefined, "the board holds the record");
    return record;
};

const firstOf = function firstOf(source: string): BoardRecord {
    return present(boardRecords(source)[0]);
};

const RECORDS = boardRecords(BOARD);
const RECORD_A = present(RECORDS[0]);

describe("peerSet and addressee", () => {
    it("read the letter a record addresses, and the active seats a record may answer", () => {
        assert.equal(addressee(RECORD_A), "A");
        assert.deepEqual([...peerSet(RECORDS, "")], ["A", "B"]);
    });
});

describe("checkAnswer", () => {
    it("refuses an answer a record addresses to itself or to a seat not on the board, and passes one to a peer", () => {
        const peers = peerSet(RECORDS, "");
        assert.equal(checkAnswer(RECORD_A, `${ANSWER_PREFIX}A`, peers)[0]?.rule, "board/selfAnswer");
        assert.equal(checkAnswer(RECORD_A, `${ANSWER_PREFIX}Z`, peers)[0]?.rule, "board/danglingAnswer");
        assert.deepEqual(checkAnswer(RECORD_A, `${ANSWER_PREFIX}B`, peers), []);
    });
});

describe("checkRecord and checkRepetition", () => {
    it("report a missing field, an undeclared field, a gate state outside the set, and a claim stated twice", () => {
        const gate = present(RECORDS.find((record) => record.kind === "gate"));
        assert.deepEqual(
            checkRecord(gate, new Set()).map((finding) => finding.rule),
            ["board/missingField", "board/badState"],
        );
        const extra = firstOf(["Agent A — ACTIVE", ...fields(), "  Mood: fine"].join("\n"));
        assert.deepEqual(
            checkRecord(extra, new Set()).map((finding) => finding.rule),
            ["board/extraField"],
        );
        const claim = Array.from({ length: CLAIM_WORDS }, (_, at) => `word${String(at)}`).join(" ");
        const repeated = firstOf(["Agent A — ACTIVE", `  Status: ${claim} ${claim}`].join("\n"));
        assert.equal(checkRepetition(repeated)[0]?.rule, "board/repeatedClaim");
        assert.deepEqual(checkRepetition(RECORD_A), []);
    });
});

describe("stateDrift, healStateDrift and checkStateDrift", () => {
    it("find a seat whose board marker disagrees with the index, and rewrite the marker to the index's state", () => {
        const index = "| A | graph | INACTIVE |\n| B | doc | ACTIVE |";
        const drifts = stateDrift(RECORDS, index);
        assert.deepEqual(drifts, [{ bound: "INACTIVE", letter: "A", line: 1, marker: "ACTIVE" }]);
        assert.equal(healStateDrift(BOARD, drifts).split("\n")[0], "Agent A — INACTIVE");
        assert.equal(checkStateDrift(drifts)[0]?.rule, "board/derivedStateDrift");
        assert.deepEqual(stateDrift(RECORDS, ""), []);
    });
});

describe("checkAddressees", () => {
    it("reports an item addressed to a seat the board does not hold active", () => {
        const source = `${BOARD}\nTo C, B — read this`;
        assert.deepEqual(
            checkAddressees(source, "").map((finding) => [finding.rule, finding.locus]),
            [["board/danglingAddressee", "C"]],
        );
    });
});
