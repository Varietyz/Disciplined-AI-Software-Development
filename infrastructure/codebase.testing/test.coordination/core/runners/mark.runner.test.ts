import { AWAITING_MARKER, UNREAD_MARKER } from "coordination-surface/tools/core/constants/blocking.constants.ts";
import {
    alreadyMarked,
    itemNotFound,
    marked,
    notAddressed,
} from "coordination-surface/tools/core/strings/mark.strings.ts";
import {
    authorOf,
    carriesLedger,
    healRequested,
    markedReaders,
    rosterFor,
    runMark,
    runRoster,
    unmarkedReaders,
} from "coordination-surface/tools/core/runners/mark.runner.ts";
import { describe, it } from "vitest";
import { dirname, join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import {
    raiseRefused,
    rosterLinesMissing,
    rosterNotVenue,
    rosterRegression,
    rosterResolved,
    rosterUnchanged,
    rosterVenueElsewhere,
} from "coordination-surface/tools/core/strings/venue.strings.ts";
import { surfacePath, surfacePrefix } from "coordination-surface/config/surface.config.ts";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const OPENER = "┌─── AGENT A-1 at:5 to:B";
const VENUE = "probe.blocking.md";

const refused = (reason: string): { code: number; message: string; raised: null } => ({
    code: 2,
    message: raiseRefused(reason),
    raised: null,
});

const withBoard = function withBoard(check: (root: string) => void): void {
    const root = mkdtempSync(join(tmpdir(), "coordination-mark-"));
    try {
        const board = resolve(root, surfacePath("board"));
        mkdirSync(dirname(board), { recursive: true });
        writeVerbatim(
            board,
            ["Agent A — ACTIVE", "Agent B — ACTIVE", OPENER, "take the index", "└─── END AGENT A-1"].join("\n"),
        );
        mkdirSync(resolve(root, surfacePrefix()), { recursive: true });
        check(root);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
};

describe("the reader ledger", () => {
    it("reads the marked readers, the author and whether a marker carries a ledger, and names the readers still owed", () => {
        assert.deepEqual(markedReaders(`${OPENER} read:B,C`), ["B", "C"]);
        assert.deepEqual(markedReaders(OPENER.replace(" at:5 to:B", "")), []);
        assert.equal(authorOf("A-1"), "A");
        assert.equal(authorOf("B"), "B");
        assert.equal(carriesLedger(OPENER), true);
        assert.equal(carriesLedger("plain text"), false);
        assert.deepEqual(unmarkedReaders(`${OPENER} read:B`, ["B", "C"], ["B", "C", "D"], "A"), ["C"]);
        assert.deepEqual(unmarkedReaders("", [], ["A", "B"], "A"), ["B"]);
        assert.equal(healRequested(["--rehearse"], "--rehearse"), false);
        assert.equal(healRequested([], "--rehearse"), true);
    });
});

describe("runMark", () => {
    it("marks an addressed reader once, and refuses a missing item or a seat the item is not addressed to", () => {
        withBoard((root) => {
            const absolute = resolve(root, surfacePath("board"));
            const request = { absolute, agent: "B", item: "A-1", target: "board" };
            assert.deepEqual(runMark({ ...request, item: "Z-9" }), { code: 2, message: itemNotFound("Z-9", "board") });
            assert.deepEqual(runMark({ ...request, agent: "C" }), { code: 2, message: notAddressed("A-1", "C") });
            assert.deepEqual(runMark(request), { code: 0, message: marked("B", "A-1") });
            assert.ok(readFileSync(absolute, "utf8").includes(`${OPENER} read:B`));
            assert.deepEqual(runMark(request), { code: 0, message: alreadyMarked("B", "A-1") });
        });
    });
});

describe("rosterFor and runRoster", () => {
    it("derive a venue's roster from the active seats, write it once, and refuse a regression or a missing roster", () => {
        withBoard((root) => {
            assert.deepEqual(rosterFor(root, ["A"]), { read: ["A"], unread: ["B"] });
            const absolute = resolve(root, surfacePrefix(), VENUE);
            assert.deepEqual(runRoster({ name: "notes.md", repoRoot: root }), refused(rosterNotVenue("notes.md")));
            assert.deepEqual(runRoster({ name: VENUE, repoRoot: root }), refused(rosterVenueElsewhere(VENUE)));
            writeVerbatim(absolute, "# Venue\n");
            assert.deepEqual(runRoster({ name: VENUE, repoRoot: root }), refused(rosterLinesMissing(VENUE)));
            writeVerbatim(absolute, [`${UNREAD_MARKER} B`, `${AWAITING_MARKER} —`].join("\n"));
            assert.deepEqual(runRoster({ name: VENUE, repoRoot: root }), refused(rosterRegression(VENUE, ["A"])));
            writeVerbatim(absolute, [`${UNREAD_MARKER} A B`, `${AWAITING_MARKER} A`].join("\n"));
            assert.deepEqual(runRoster({ name: VENUE, repoRoot: root }), {
                code: 0,
                message: rosterResolved(VENUE, "B", "A"),
                raised: VENUE,
            });
            assert.deepEqual(runRoster({ name: VENUE, repoRoot: root }), {
                code: 0,
                message: rosterUnchanged(VENUE),
                raised: VENUE,
            });
        });
    });
});
