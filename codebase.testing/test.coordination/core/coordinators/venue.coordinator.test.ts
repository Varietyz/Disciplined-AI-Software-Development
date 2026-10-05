import {
    ARRIVE_NOT_VENUE,
    RETRACT_NOT_VENUE,
    raiseRefused,
    relocateNotVenue,
    retireNotPlanning,
} from "coordination-surface/tools/core/strings/venue.strings.ts";
import { arrive, relocate, retire, retract } from "coordination-surface/tools/core/coordinators/venue.coordinator.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";

const NOTES = "notes.md";

const INVOCATION = { absolute: join(tmpdir(), "coordination-absent", NOTES), caller: "A", target: NOTES };

const withArgv = function withArgv<T>(argv: readonly string[], read: () => T): T {
    const held = process.argv;
    process.argv = ["node", "board.entrypoint.ts", ...argv];
    try {
        return read();
    } finally {
        process.argv = held;
    }
};

const refused = (reason: string): { code: number; message: string; raised: null } => ({
    code: 2,
    message: raiseRefused(reason),
    raised: null,
});

describe("the venue forms", () => {
    it("answer nothing when their flag is absent, and hand their operands to the runner when it is present", () => {
        withArgv([], () => {
            assert.equal(relocate(), null);
            assert.equal(retire(), null);
            assert.equal(retract(INVOCATION), null);
            assert.equal(arrive(INVOCATION), null);
        });
        assert.deepEqual(
            withArgv(["--relocate", NOTES], () => relocate()),
            refused(relocateNotVenue(NOTES)),
        );
        assert.deepEqual(
            withArgv(["--retire", NOTES], () => retire()),
            refused(retireNotPlanning(NOTES)),
        );
        assert.deepEqual(
            withArgv(["--retract", "a clause"], () => retract(INVOCATION)),
            refused(RETRACT_NOT_VENUE),
        );
        assert.deepEqual(
            withArgv(["--arrive"], () => arrive(INVOCATION)),
            refused(ARRIVE_NOT_VENUE),
        );
    });
});
