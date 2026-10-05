import { activeLetters, compareSpans, dropItemSpan } from "coordination-surface/tools/core/resolvers/board.resolver.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const ITEM = ["┌─── AGENT A-1 · judgment ───", "To B — read the draft.", "└─── END AGENT A-1"];

const BOARD = ["# Board", "Agent A — ACTIVE", ...ITEM, "Agent B — INACTIVE", "Agent C"].join("\n");

describe("activeLetters", () => {
    it("reads the seats active on the board, or the ones the index allocates when it allocates any", () => {
        assert.deepEqual([...activeLetters(BOARD, "")], ["A", "C"]);
        assert.deepEqual([...activeLetters(BOARD, "| C | graph | INACTIVE |\n| B | doc | ACTIVE |")], ["B"]);
    });
});

describe("dropItemSpan", () => {
    it("removes an item's fenced span and reports how much it removed, and answers null for an unknown item", () => {
        const dropped = dropItemSpan(BOARD, "A-1");
        assert.ok(dropped !== null);
        assert.equal(dropped.text, ["# Board", "Agent A — ACTIVE", "Agent B — INACTIVE", "Agent C"].join("\n"));
        assert.equal(dropped.removed, ITEM.join("\n").length);
        assert.equal(dropItemSpan(BOARD, "Z-9"), null);
    });
});

describe("compareSpans", () => {
    it("names the lines added to and removed from an agent's span since it was read", () => {
        const witness = BOARD.replace("To B — read the draft.", "To B — read the second draft.");
        assert.deepEqual(compareSpans(BOARD, witness, "A-1"), {
            added: ["To B — read the second draft."],
            overlapping: true,
            removed: ["To B — read the draft."],
        });
        assert.deepEqual(compareSpans(BOARD, BOARD, "A-1"), { added: [], overlapping: false, removed: [] });
        assert.equal(compareSpans(BOARD, "# empty", "A-1").overlapping, true);
    });
});
