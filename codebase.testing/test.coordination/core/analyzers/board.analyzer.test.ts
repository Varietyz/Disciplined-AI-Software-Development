import {
    ACTIVE_STATE,
    activeAgents,
    activeSeats,
    boardRecords,
    fieldKeyAt,
    seatState,
    unresolvedAddressing,
} from "coordination-surface/tools/core/analyzers/board.analyzer.ts";
import {
    delimitersIn,
    enclosingRecord,
    itemSpanFlags,
} from "coordination-surface/tools/core/analyzers/fence.analyzer.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const BOARD = [
    "# Board",
    "Agent A — ACTIVE",
    "  Owns: kit/core",
    "  Status: drafting",
    "┌─── AGENT A-1 · judgment ───",
    "To B — read the draft.",
    "  Hidden: not a field",
    "└─── END AGENT A-1",
    "└─── END AGENT A",
    "Agent B — INACTIVE",
    "  Owns: config",
    "Gate converge — open",
].join("\n");

describe("delimitersIn and enclosingRecord", () => {
    it("reads every open and close marker with its agent key and line", () => {
        assert.deepEqual(delimitersIn(BOARD), [
            { agent: "A-1", line: 5, open: true },
            { agent: "A-1", line: 8, open: false },
            { agent: "A", line: 9, open: false },
        ]);
    });

    it("resolves a line to the narrowest span that holds it", () => {
        const source = [
            "┌─── AGENT A",
            "┌─── AGENT A-1",
            "inside the item",
            "└─── END AGENT A-1",
            "└─── END AGENT A",
        ].join("\n");
        const holder = enclosingRecord(source);
        assert.equal(holder(3), "A-1");
        assert.equal(holder(5), "A");
        assert.equal(holder(9), null);
    });
});

describe("itemSpanFlags", () => {
    it("flags the lines inside an item's fence and nothing else", () => {
        const flags = itemSpanFlags(BOARD);
        assert.deepEqual(
            flags.map((flag, index) => (flag ? index : -1)).filter((index) => index !== -1),
            [5, 6],
        );
    });
});

describe("boardRecords", () => {
    it("reads agent and gate records with their state and indented fields, skipping item bodies", () => {
        const records = boardRecords(BOARD);
        assert.deepEqual(
            records.map((record) => [record.kind, record.label, record.state, record.line]),
            [
                ["agent", "Agent A", "ACTIVE", 2],
                ["agent", "Agent B", "INACTIVE", 10],
                ["gate", "Gate converge", "open", 12],
            ],
        );
        assert.deepEqual(
            [...(records[0]?.fields ?? new Map())],
            [
                ["Owns", "kit/core"],
                ["Status", "drafting"],
            ],
        );
    });
});

describe("seatState, activeSeats and activeAgents", () => {
    it("reads a seat's state from its board marker when no index allocates letters", () => {
        assert.equal(seatState("")("A", ACTIVE_STATE), ACTIVE_STATE);
        assert.deepEqual(activeSeats(BOARD, ""), ["A"]);
        assert.equal(activeAgents(BOARD, ""), 1);
    });

    it("reads a seat's state from the index when the index allocates letters, and the index wins", () => {
        const index = "| A | governance | INACTIVE |\n| B | document | ACTIVE |";
        assert.equal(seatState(index)("C", ACTIVE_STATE), "");
        assert.deepEqual(activeSeats(BOARD, index), ["B"]);
    });
});

describe("fieldKeyAt", () => {
    it("reads the key of a field line indented once, and nothing from deeper, spaced or unkeyed lines", () => {
        assert.equal(fieldKeyAt("  Owns: kit/core"), "Owns");
        assert.equal(fieldKeyAt("    Owns: nested"), "");
        assert.equal(fieldKeyAt("  Two words: x"), "");
        assert.equal(fieldKeyAt("  no colon"), "");
        assert.equal(fieldKeyAt("Owns: flush"), "");
    });
});

describe("unresolvedAddressing", () => {
    it("reports a broadcast item whose opener addresses named agents instead of everyone", () => {
        const source = [
            "meta to:*",
            "To B — only one reader",
            "meta to:*",
            "To ALL — everyone",
            "no meta",
            "To C",
        ].join("\n");
        assert.deepEqual(unresolvedAddressing(source), [{ line: 1, opener: "To B — only one reader" }]);
    });
});
