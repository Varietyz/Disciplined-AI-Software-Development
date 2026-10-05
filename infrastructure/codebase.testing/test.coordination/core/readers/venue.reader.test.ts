import {
    SIGN_OFF_BANNER,
    signOffLines,
    signOffSection,
    surfaceText,
    textIfPresent,
    venueRecords,
} from "coordination-surface/tools/core/readers/venue.reader.ts";
import { describe, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("textIfPresent and surfaceText", () => {
    it("read a file's text, or answer empty text for one that does not exist", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-venue-reader-"));
        try {
            writeVerbatim(join(root, "a.md"), "text");
            assert.equal(textIfPresent(join(root, "a.md")), "text");
            assert.equal(surfaceText(root, "a.md"), "text");
            assert.equal(surfaceText(root, "missing.md"), "");
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});

describe("signOffSection and signOffLines", () => {
    it("read each seat's sign-off below the banner, the first line per seat standing", () => {
        const venue = [
            "prose: not a sign-off",
            SIGN_OFF_BANNER,
            "A: agree",
            "BC: agree",
            "B: first",
            "B: second",
            "x: no",
        ].join("\n");
        assert.equal(signOffSection(venue).length, 5);
        assert.deepEqual(
            [...signOffLines(venue)],
            [
                ["B", "first"],
                ["BC", "agree"],
                ["A", "agree"],
            ],
        );
        assert.deepEqual(signOffSection("no banner"), []);
    });
});

describe("venueRecords", () => {
    it("map each seat's record to its fields", () => {
        const records = venueRecords("Agent A — ACTIVE\n  Status: drafting\nGate g — open");
        assert.deepEqual([...records.keys()], ["A"]);
        assert.equal(records.get("A")?.get("Status"), "drafting");
    });
});
