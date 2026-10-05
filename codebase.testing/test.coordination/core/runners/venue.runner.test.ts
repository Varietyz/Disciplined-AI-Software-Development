import {
    RAISE_AGENDA_MISSING,
    RELOCATE_ROOT_MISSING,
    SUCCESSOR_NOT_VENUE,
    raiseRefused,
    relocateDestinationTaken,
    relocateNotVenue,
    relocateSourceMissing,
    relocated,
    successorNotPlanned,
    successorVenueMissing,
} from "coordination-surface/tools/core/strings/venue.strings.ts";
import { describe, it } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { runRaise, runRelocate, runSuccessor } from "coordination-surface/tools/core/runners/venue.runner.ts";
import assert from "node:assert/strict";
import { surfacePrefix } from "coordination-surface/config/surface.config.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const VENUE = "probe.blocking.md";

const refused = (reason: string): { code: number; message: string; raised: null } => ({
    code: 2,
    message: raiseRefused(reason),
    raised: null,
});

const withRoot = function withRoot(check: (root: string) => void): void {
    const root = mkdtempSync(join(tmpdir(), "coordination-venue-run-"));
    try {
        check(root);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
};

describe("runSuccessor", () => {
    it("refuses a target that is no venue, a missing venue, and an invariant the agenda does not plan", () => {
        withRoot((root) => {
            const absolute = join(root, VENUE);
            const request = { absolute, invariant: "unplanned-probe", target: VENUE };
            assert.deepEqual(runSuccessor({ ...request, target: "notes.md" }), refused(SUCCESSOR_NOT_VENUE));
            assert.deepEqual(runSuccessor(request), refused(successorVenueMissing(VENUE)));
            writeVerbatim(absolute, "# Venue\n");
            assert.deepEqual(runSuccessor(request), refused(successorNotPlanned("unplanned-probe")));
        });
    });
});

describe("runRelocate", () => {
    it("moves a stray venue into the venue root, and refuses a missing root, a taken destination or a missing source", () => {
        withRoot((root) => {
            const request = { name: VENUE, repoRoot: root };
            assert.deepEqual(runRelocate({ ...request, name: "notes.md" }), refused(relocateNotVenue("notes.md")));
            const venueRoot = resolve(root, surfacePrefix());
            assert.deepEqual(runRelocate(request), refused(RELOCATE_ROOT_MISSING));
            mkdirSync(venueRoot, { recursive: true });
            assert.deepEqual(runRelocate(request), refused(relocateSourceMissing(VENUE)));
            writeVerbatim(join(root, VENUE), "# Venue\n");
            assert.deepEqual(runRelocate(request), { code: 0, message: relocated(VENUE), raised: VENUE });
            assert.equal(readFileSync(join(venueRoot, VENUE), "utf8"), "# Venue\n");
            assert.equal(existsSync(join(root, VENUE)), false);
            writeVerbatim(join(root, VENUE), "# Venue\n");
            assert.deepEqual(runRelocate(request), refused(relocateDestinationTaken(VENUE)));
        });
    });
});

describe("runRaise", () => {
    it("passes the raise plan's refusal through when the agenda is missing", () => {
        withRoot((root) => {
            assert.deepEqual(runRaise({ declared: null, repoRoot: root, seats: ["A"] }), refused(RAISE_AGENDA_MISSING));
        });
    });
});
