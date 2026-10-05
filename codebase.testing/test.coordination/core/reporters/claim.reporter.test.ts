import {
    claimEcho,
    claimFieldAbsent,
    closableByYou,
    dischargeEcho,
} from "coordination-surface/tools/core/strings/board.strings.ts";
import { describe, it } from "vitest";
import { dirname, join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { ownClaimEcho, ownDischargeEcho } from "coordination-surface/tools/core/reporters/claim.reporter.ts";
import assert from "node:assert/strict";
import { surfacePath } from "coordination-surface/config/surface.config.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const BOARD = [
    "Agent A — ACTIVE",
    "  Status: indexing",
    "┌─── AGENT A-1 at:5 to:B",
    "take the index",
    "└─── END AGENT A-1",
    "",
].join("\n");

describe("ownClaimEcho and ownDischargeEcho", () => {
    it("echo a seat's own claim once its work moved, and the items addressed to it that it can close", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-claim-"));
        try {
            assert.equal(ownClaimEcho(root, "A"), "");
            assert.equal(ownDischargeEcho(root, "B"), "");
            const board = resolve(root, surfacePath("board"));
            mkdirSync(dirname(board), { recursive: true });
            writeVerbatim(board, BOARD);
            assert.equal(
                ownClaimEcho(root, "A"),
                claimEcho(surfacePath("board"), ["  Status: indexing", claimFieldAbsent("Flags")]),
            );
            assert.equal(ownClaimEcho(root, "B"), "");
            assert.equal(ownDischargeEcho(root, "B"), dischargeEcho([closableByYou(["A-1"])]));
            assert.equal(ownDischargeEcho(root, "A"), "");
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
