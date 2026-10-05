import {
    authorOf,
    closureText,
    writeBoardIfUnmoved,
} from "coordination-surface/tools/core/generators/board.generator.ts";
import { describe, it } from "vitest";
import { dirname, join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, readFileSync } from "node:fs";
import { BOARD_PATH } from "coordination-surface/tools/core/constants/board.constants.ts";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const ITEM = ["┌─── AGENT A-1 ─── kind:judgment", "To B — review the draft", "└─── END AGENT A-1"];
const WITH_B = ["Agent A — ACTIVE", "Agent B — ACTIVE", ...ITEM].join("\n");
const WITHOUT_B = ["Agent A — ACTIVE", ...ITEM].join("\n");

describe("authorOf", () => {
    it("reads the writing agent from an item id, or returns a bare letter unchanged", () => {
        assert.equal(authorOf("A-12"), "A");
        assert.equal(authorOf("B"), "B");
    });
});

describe("closureText", () => {
    it("lets an addressee close the item", () => {
        assert.equal(closureText("A-1", "ref", WITH_B, "B", ""), "CLOSES A-1 — handled · ref");
    });

    it("refuses a seat the item is not addressed to while an addressee is active", () => {
        assert.equal(
            closureText("A-1", "ref", WITH_B, "C", "")?.startsWith("NOTREADER  A-1 is addressed to B, not to C"),
            true,
        );
    });

    it("lets only the author close an item whose every addressee is inactive", () => {
        assert.equal(closureText("A-1", "ref", WITHOUT_B, "C", "")?.startsWith("NOTREADER"), true);
        assert.equal(closureText("A-1", "ref", WITHOUT_B, "A", "")?.startsWith("CLOSES A-1 — stranded"), true);
    });

    it("returns null for an item with no single fenced block", () => {
        assert.equal(closureText("A-9", "ref", WITH_B, "B", ""), null);
    });
});

describe("writeBoardIfUnmoved", () => {
    it("writes when the board still holds what was read, and refuses when it moved", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-board-write-"));
        mkdirSync(dirname(resolve(root, BOARD_PATH)), { recursive: true });
        writeVerbatim(resolve(root, BOARD_PATH), WITH_B);
        assert.equal(writeBoardIfUnmoved(root, "an older read", "rendered"), false);
        assert.equal(writeBoardIfUnmoved(root, WITH_B, "rendered"), true);
        assert.equal(readFileSync(resolve(root, BOARD_PATH), "utf8"), "rendered");
    });
});
