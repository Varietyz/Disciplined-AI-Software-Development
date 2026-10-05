import {
    CLAUSE_IS_RECEIVER,
    DEFER_NOT_VENUE,
    RETRACT_NOT_VENUE,
    clauseDeferred,
    clauseRetracted,
    clauseTaken,
    deferVenueMissing,
    deferredSectionMissing,
    defersNothing,
    raiseRefused,
    receiverUnknown,
    retractClauseMissing,
    retractSectionMissing,
    retractVenueMissing,
} from "coordination-surface/tools/core/strings/venue.strings.ts";
import { afterAll, beforeAll, describe, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { runDefer, runRetract } from "coordination-surface/tools/core/runners/blocking.runner.ts";
import { DEFERRED_SECTION } from "coordination-surface/tools/core/analyzers/converge.analyzer.ts";
import { RECORD_ABSENT } from "coordination-surface/tools/core/constants/blocking.constants.ts";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const TARGET = "probe.blocking.md";
const RECEIVER = "other";
const RECEIVER_VENUE = "other.03.blocking.md";
const CLAUSE = "the index write";

const VENUE = ["# Venue", `## ${DEFERRED_SECTION}`, "", "## POSITIONS", ""].join("\n");

const refused = (reason: string): { code: number; message: string; raised: null } => ({
    code: 2,
    message: raiseRefused(reason),
    raised: null,
});

describe("runDefer and runRetract", () => {
    let root = "";
    let absolute = "";

    beforeAll(() => {
        root = mkdtempSync(join(tmpdir(), "coordination-defer-"));
        absolute = join(root, TARGET);
        writeVerbatim(join(root, RECEIVER_VENUE), "");
    });

    afterAll(() => {
        rmSync(root, { force: true, recursive: true });
    });

    it("refuses a target that is no venue, a missing venue or section, the clause as its own receiver, and an unknown receiver", () => {
        const request = { absolute, clause: CLAUSE, receiver: RECEIVER, repoRoot: root, target: TARGET };
        assert.deepEqual(runDefer({ ...request, target: "notes.md" }), refused(DEFER_NOT_VENUE));
        assert.deepEqual(runDefer(request), refused(deferVenueMissing(TARGET)));
        writeVerbatim(absolute, "# Venue\n");
        assert.deepEqual(runDefer({ ...request, receiver: CLAUSE }), refused(CLAUSE_IS_RECEIVER));
        assert.deepEqual(runDefer({ ...request, receiver: "Z" }), refused(receiverUnknown("Z")));
        assert.deepEqual(runDefer(request), refused(deferredSectionMissing(TARGET, DEFERRED_SECTION)));
        assert.deepEqual(
            runDefer({ ...request, clause: RECORD_ABSENT }),
            refused(deferredSectionMissing(TARGET, DEFERRED_SECTION)),
        );
    });

    it("marks a venue that defers nothing, defers a clause once to a known receiver, and retracts it", () => {
        const request = { absolute, clause: CLAUSE, receiver: RECEIVER, repoRoot: root, target: TARGET };
        writeVerbatim(absolute, VENUE);
        assert.deepEqual(runDefer({ ...request, clause: RECORD_ABSENT }), {
            code: 0,
            message: defersNothing(TARGET),
            raised: null,
        });
        assert.ok(readFileSync(absolute, "utf8").includes(`- ${RECORD_ABSENT}`));

        writeVerbatim(absolute, VENUE);
        assert.deepEqual(runDefer(request), {
            code: 0,
            message: clauseDeferred(CLAUSE, RECEIVER, TARGET),
            raised: CLAUSE,
        });
        assert.deepEqual(runDefer(request), refused(clauseTaken(TARGET, CLAUSE)));

        const retract = { absolute, clause: CLAUSE, target: TARGET };
        assert.deepEqual(runRetract({ ...retract, clause: "ghost" }), refused(retractClauseMissing(TARGET, "ghost")));
        assert.deepEqual(runRetract(retract), { code: 0, message: clauseRetracted(CLAUSE, TARGET), raised: CLAUSE });
        assert.ok(!readFileSync(absolute, "utf8").includes(CLAUSE));
    });

    it("runRetract refuses a target that is no venue, a missing venue and a missing section", () => {
        const retract = { absolute: join(root, "absent.blocking.md"), clause: CLAUSE, target: "absent.blocking.md" };
        assert.deepEqual(runRetract({ ...retract, target: "notes.md" }), refused(RETRACT_NOT_VENUE));
        assert.deepEqual(runRetract(retract), refused(retractVenueMissing("absent.blocking.md")));
        writeVerbatim(absolute, "# Venue\n");
        assert.deepEqual(
            runRetract({ absolute, clause: CLAUSE, target: TARGET }),
            refused(retractSectionMissing(TARGET, DEFERRED_SECTION)),
        );
    });
});
