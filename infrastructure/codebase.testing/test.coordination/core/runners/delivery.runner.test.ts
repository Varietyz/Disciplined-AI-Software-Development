import {
    ARRIVE_NOT_VENUE,
    ARRIVE_NO_SUCCESSOR,
    arrivalHeld,
    arriveNoInheritedSection,
    arrivePredecessorMissing,
    arriveSuccessorUnraised,
    arrived,
    inheritNotVenue,
    inheritSectionMissing,
    inheritSectionUnbounded,
    inheritUnchanged,
    inheritUpdated,
    inheritVenueElsewhere,
    raiseRefused,
} from "coordination-surface/tools/core/strings/venue.strings.ts";
import { DEFERRAL_ARROW, DEFERRED_SECTION } from "coordination-surface/tools/core/analyzers/converge.analyzer.ts";
import { INHERITED_BANNER, PROTOCOL_BANNER } from "coordination-surface/tools/core/constants/blocking.constants.ts";
import { describe, it } from "vitest";
import { join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { runArrive, runInherit } from "coordination-surface/tools/core/runners/delivery.runner.ts";
import assert from "node:assert/strict";
import { surfacePrefix } from "coordination-surface/config/surface.config.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const PREDECESSOR = "index.01.blocking.md";
const SUCCESSOR = "next.02.blocking.md";

const PREDECESSOR_TEXT = [
    "# Venue",
    "SUCCESSOR: next",
    `## ${DEFERRED_SECTION}`,
    `- **the write** ${DEFERRAL_ARROW} next`,
    `- **the audit** ${DEFERRAL_ARROW} elsewhere`,
    "## POSITIONS",
].join("\n");

const SUCCESSOR_TEXT = [`${INHERITED_BANNER} from 01 ═══`, "- carried earlier", PROTOCOL_BANNER, ""].join("\n");

const refused = (reason: string): { code: number; message: string; raised: null } => ({
    code: 2,
    message: raiseRefused(reason),
    raised: null,
});

const withVenues = function withVenues(check: (root: string, venues: string) => void): void {
    const root = mkdtempSync(join(tmpdir(), "coordination-delivery-"));
    try {
        const venues = resolve(root, surfacePrefix());
        mkdirSync(venues, { recursive: true });
        check(root, venues);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
};

describe("runArrive", () => {
    it("refuses a predecessor that is no venue, is missing, declares no successor, or whose successor cannot receive", () => {
        withVenues((_root, venues) => {
            const absolute = join(venues, PREDECESSOR);
            assert.deepEqual(runArrive({ absolute, predecessor: "notes.md" }), refused(ARRIVE_NOT_VENUE));
            assert.deepEqual(
                runArrive({ absolute, predecessor: PREDECESSOR }),
                refused(arrivePredecessorMissing(PREDECESSOR)),
            );
            writeVerbatim(absolute, "# Venue\n");
            assert.deepEqual(runArrive({ absolute, predecessor: PREDECESSOR }), refused(ARRIVE_NO_SUCCESSOR));
            writeVerbatim(absolute, PREDECESSOR_TEXT);
            assert.deepEqual(
                runArrive({ absolute, predecessor: PREDECESSOR }),
                refused(arriveSuccessorUnraised("next.blocking.md")),
            );
            writeVerbatim(join(venues, SUCCESSOR), "# Successor\n");
            assert.deepEqual(
                runArrive({ absolute, predecessor: PREDECESSOR }),
                refused(arriveNoInheritedSection(SUCCESSOR)),
            );
        });
    });

    it("carries each clause deferred to the successor into its inherited section, and holds a clause routed elsewhere", () => {
        withVenues((_root, venues) => {
            const absolute = join(venues, PREDECESSOR);
            writeVerbatim(absolute, PREDECESSOR_TEXT);
            writeVerbatim(join(venues, SUCCESSOR), SUCCESSOR_TEXT);
            assert.deepEqual(runArrive({ absolute, predecessor: PREDECESSOR }), {
                code: 0,
                message: arrived(1, PREDECESSOR, SUCCESSOR, ["the write"]),
                raised: SUCCESSOR,
            });
            assert.ok(readFileSync(join(venues, SUCCESSOR), "utf8").includes(`- the write ${DEFERRAL_ARROW} next`));
            assert.deepEqual(runArrive({ absolute, predecessor: PREDECESSOR }), {
                code: 0,
                message: arrivalHeld(SUCCESSOR, [`the audit ${DEFERRAL_ARROW} elsewhere`]),
                raised: null,
            });
        });
    });
});

describe("runInherit", () => {
    it("rewrites a venue's inherited section from the venues deferring to it, once, and refuses what it cannot bound", () => {
        withVenues((root, venues) => {
            const request = { name: SUCCESSOR, repoRoot: root };
            assert.deepEqual(runInherit({ ...request, name: "notes.md" }), refused(inheritNotVenue("notes.md")));
            assert.deepEqual(runInherit(request), refused(inheritVenueElsewhere(SUCCESSOR)));
            writeVerbatim(join(venues, SUCCESSOR), "# Successor\n");
            assert.deepEqual(runInherit(request), refused(inheritSectionMissing(SUCCESSOR)));
            writeVerbatim(join(venues, SUCCESSOR), `${INHERITED_BANNER} ═══\n`);
            assert.deepEqual(runInherit(request), refused(inheritSectionUnbounded(SUCCESSOR)));
            writeVerbatim(join(venues, PREDECESSOR), PREDECESSOR_TEXT);
            writeVerbatim(join(venues, SUCCESSOR), SUCCESSOR_TEXT);
            assert.deepEqual(runInherit(request), {
                code: 0,
                message: inheritUpdated(SUCCESSOR, 1, PREDECESSOR),
                raised: SUCCESSOR,
            });
            assert.deepEqual(runInherit(request), { code: 0, message: inheritUnchanged(SUCCESSOR), raised: SUCCESSOR });
        });
    });
});
