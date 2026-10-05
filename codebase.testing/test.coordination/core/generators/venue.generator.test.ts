import { DEFERRAL_ARROW, DEFERRED_SECTION } from "coordination-surface/tools/core/analyzers/converge.analyzer.ts";
import {
    INHERITED_BANNER,
    RECORD_ABSENT,
    VENUE_ARCHIVE,
} from "coordination-surface/tools/core/constants/blocking.constants.ts";
import {
    NO_VENUE_DEFERRING,
    inheritedSection,
    unclaimedSection,
} from "coordination-surface/tools/core/strings/venue.strings.ts";
import {
    blockFor,
    deferringLabel,
    deferringVenues,
    ordinalOf,
    recordSpecimen,
    seatRecord,
    siblingVenues,
} from "coordination-surface/tools/core/generators/venue.generator.ts";
import { describe, it } from "vitest";
import { join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const OPEN_VENUE = "index.02.blocking.md";

const deferred = function deferred(receiver: string): string {
    return ["# Venue", `## ${DEFERRED_SECTION}`, `- **the write** ${DEFERRAL_ARROW} ${receiver}`].join("\n");
};

describe("ordinalOf", () => {
    it("reads the first dot segment that opens with a digit, and nothing when none does", () => {
        assert.equal(ordinalOf(`archive/${OPEN_VENUE}`), "02");
        assert.equal(ordinalOf("index.blocking.md"), "");
    });
});

describe("blockFor and deferringLabel", () => {
    it("inherit the deferred clauses by the predecessor's ordinal, or open an unclaimed block when none were deferred", () => {
        assert.equal(
            blockFor("next", { clauses: ["a", "b"], names: [OPEN_VENUE] }),
            inheritedSection(INHERITED_BANNER, "02", "- a\n- b"),
        );
        assert.equal(
            blockFor("next", { clauses: [], names: [] }),
            unclaimedSection(INHERITED_BANNER, "next", RECORD_ABSENT),
        );
        assert.equal(deferringLabel({ clauses: [], names: [] }), NO_VENUE_DEFERRING);
        assert.equal(
            deferringLabel({ clauses: [], names: ["a.blocking.md", "b.blocking.md"] }),
            "a.blocking.md, b.blocking.md",
        );
    });
});

describe("deferringVenues and siblingVenues", () => {
    it("collect the clauses open and archived venues defer to an invariant, and list every venue by name", () => {
        const repoRoot = mkdtempSync(join(tmpdir(), "coordination-deferring-"));
        try {
            const directory = join(repoRoot, "open");
            const archive = resolve(repoRoot, VENUE_ARCHIVE);
            mkdirSync(directory);
            mkdirSync(archive, { recursive: true });
            writeVerbatim(join(directory, OPEN_VENUE), deferred("next"));
            writeVerbatim(join(archive, "old.01.blocking.md"), deferred("other"));
            writeVerbatim(join(directory, "notes.md"), "");
            assert.deepEqual(siblingVenues(directory, repoRoot), [OPEN_VENUE, "old.01.blocking.md"]);
            assert.deepEqual(deferringVenues(directory, repoRoot, "next"), {
                clauses: ["the write"],
                names: [OPEN_VENUE],
            });
        } finally {
            rmSync(repoRoot, { force: true, recursive: true });
        }
    });
});

describe("recordSpecimen and seatRecord", () => {
    it("cut the template's lettered record out at its own indent, and fill it for a seat", () => {
        const template = [
            "intro",
            "    ┌─── AGENT <letter>",
            "    Agent <letter> — <ACTIVE | INACTIVE>",
            "      Needs: <what>",
            "    └─── END AGENT <letter>",
        ].join("\n");
        const specimen = recordSpecimen(template);
        assert.deepEqual(specimen, [
            "┌─── AGENT <letter>",
            "Agent <letter> — <ACTIVE | INACTIVE>",
            "  Needs: <what>",
            "└─── END AGENT <letter>",
        ]);
        assert.deepEqual(seatRecord(specimen, "B"), [
            "┌─── AGENT B",
            "Agent B — ACTIVE",
            "  Needs:",
            "└─── END AGENT B",
        ]);
        assert.deepEqual(recordSpecimen("no record"), []);
        assert.deepEqual(recordSpecimen("┌─── AGENT <letter>\nunclosed"), []);
    });
});
