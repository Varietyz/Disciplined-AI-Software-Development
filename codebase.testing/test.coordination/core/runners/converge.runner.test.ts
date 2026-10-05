import { AWAITING_MARKER, UNREAD_MARKER } from "coordination-surface/tools/core/constants/blocking.constants.ts";
import {
    TOOL_STAMP,
    letters,
    rosterLine,
    runArchiveMove,
    runReadMark,
    runSignature,
} from "coordination-surface/tools/core/runners/converge.runner.ts";
import {
    alreadyRead,
    alreadySigned,
    moved,
    needOutstanding,
    notConvened,
    readMarked,
    rosterLinesMissing,
    signOffBlockMissing,
    signOffRowAdded,
    signed,
    venueMissingForRead,
    venueMissingForSign,
} from "coordination-surface/tools/core/strings/converge.strings.ts";
import { describe, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const TARGET = "probe.blocking.md";

const withTempVenue = function withTempVenue(check: (absolute: string, root: string) => void): void {
    const root = mkdtempSync(join(tmpdir(), "coordination-converge-run-"));
    try {
        check(join(root, TARGET), root);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
};

describe("letters and rosterLine", () => {
    it("read the seats a roster line names once each, and write a roster line back with the absent mark when empty", () => {
        assert.deepEqual(letters(`${UNREAD_MARKER} A, B A —`, UNREAD_MARKER), ["A", "B"]);
        assert.equal(rosterLine(UNREAD_MARKER, []), `${UNREAD_MARKER}        —`);
        assert.equal(rosterLine(AWAITING_MARKER, ["A", "B"]), `${AWAITING_MARKER} A B`);
    });
});

describe("runArchiveMove", () => {
    it("moves a venue to its destination, and reports a failed move", () => {
        withTempVenue((absolute, root) => {
            writeVerbatim(absolute, "venue");
            const destination = join(root, "archived.blocking.md");
            assert.deepEqual(runArchiveMove(absolute, destination, TARGET), { code: 0, message: moved(TARGET) });
            assert.equal(existsSync(absolute), false);
            assert.equal(runArchiveMove(absolute, destination, TARGET).code, 2);
        });
    });
});

describe("runReadMark", () => {
    it("moves a seat from unread to awaiting once, and refuses a missing venue or roster", () => {
        withTempVenue((absolute) => {
            const request = { absolute, agent: "A", target: TARGET, text: "" };
            assert.deepEqual(runReadMark(request), { code: 2, message: venueMissingForRead(TARGET) });
            writeVerbatim(absolute, "# Venue\n");
            assert.deepEqual(runReadMark(request), { code: 2, message: rosterLinesMissing(TARGET) });
            writeVerbatim(absolute, [`${UNREAD_MARKER}        A B`, `${AWAITING_MARKER} —`].join("\n"));
            assert.deepEqual(runReadMark(request), { code: 0, message: readMarked("A", TARGET) });
            assert.deepEqual(readFileSync(absolute, "utf8").split("\n"), [
                `${UNREAD_MARKER}        B`,
                `${AWAITING_MARKER} A`,
            ]);
            assert.deepEqual(runReadMark(request), { code: 0, message: alreadyRead("A", TARGET) });
        });
    });
});

describe("runSignature", () => {
    it("raises a sign-off row for a convened seat, refuses to sign while its need stands, then signs once", () => {
        withTempVenue((absolute) => {
            const request = { absolute, agent: "A", target: TARGET, text: "converged" };
            assert.deepEqual(runSignature(request), { code: 2, message: venueMissingForSign(TARGET) });
            writeVerbatim(absolute, "# Venue\n");
            assert.deepEqual(runSignature(request), { code: 2, message: notConvened("A", TARGET) });
            const record = ["Agent A — ACTIVE", "  Needs: the index"];
            writeVerbatim(absolute, record.join("\n"));
            assert.deepEqual(runSignature(request), { code: 2, message: signOffBlockMissing(TARGET) });
            writeVerbatim(absolute, [...record, "═══ SIGN-OFF ═══", "owner:"].join("\n"));
            assert.deepEqual(runSignature(request), { code: 0, message: signOffRowAdded("A", TARGET) });
            assert.deepEqual(runSignature(request), { code: 2, message: needOutstanding("A", TARGET, "the index") });
            writeVerbatim(absolute, readFileSync(absolute, "utf8").replace("Needs: the index", "Needs: —"));
            assert.deepEqual(runSignature(request), { code: 0, message: signed("A", TARGET, TOOL_STAMP) });
            assert.deepEqual(runSignature(request), { code: 0, message: alreadySigned("A", TARGET) });
        });
    });
});
