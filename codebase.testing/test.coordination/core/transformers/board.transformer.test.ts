import { blockOf, compressBoard } from "coordination-surface/tools/core/transformers/board.transformer.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const BOARD = ["AGENT A", "  status: working on the index", "  note: keep this", "  status"].join("\n");

describe("compressBoard", () => {
    it("resets a schema field to the empty mark and keeps its line", () => {
        const compressed = compressBoard(BOARD, "status", true);
        assert.equal(compressed.fields, 2);
        assert.deepEqual(compressed.text.split("\n"), ["AGENT A", "  status:  —", "  note: keep this", "  status:  —"]);
        assert.deepEqual(compressed.excised, ["status: working on the index", "status"]);
    });

    it("removes a marker that is not a field, dropping the line it leaves blank", () => {
        const compressed = compressBoard(BOARD, "status");
        assert.equal(compressed.fields, 2);
        assert.deepEqual(compressed.text.split("\n"), ["AGENT A", "  note: keep this"]);
    });

    it("leaves the board alone for an empty marker or a marker that only starts a longer word", () => {
        assert.equal(compressBoard(BOARD, "").text, BOARD);
        assert.equal(compressBoard(BOARD, "stat").fields, 0);
    });
});

describe("blockOf", () => {
    it("spans a seat's one open and close delimiter, and answers null for a missing, repeated or inverted pair", () => {
        const open = "┌─── AGENT A";
        const close = "└─── END AGENT A";
        assert.deepEqual(blockOf(["# Board", open, "  body", close].join("\n"), "A"), { from: 2, to: 4 });
        assert.equal(blockOf([open, "  body"].join("\n"), "A"), null);
        assert.equal(blockOf([open, close, open, close].join("\n"), "A"), null);
        assert.equal(blockOf([close, open].join("\n"), "A"), null);
    });
});
