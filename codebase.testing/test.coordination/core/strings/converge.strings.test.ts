import {
    archiveNameTaken,
    archiveRootMissing,
    convergeAbsent,
    convergeHelp,
    convergeNotVenue,
    convergePreview,
    deferredUnanswered,
    deferredUndeclared,
    durableHold,
    durableUndeclared,
    durableUnresolved,
    moveFailed,
    needsHold,
    needsMissing,
    orderingsBlock,
    rosterContended,
    signOffContended,
    signatureContended,
    successorArrived,
    successorMissing,
    successorScheduled,
    unarrivedClauses,
    undischarged,
    unoriginated,
} from "coordination-surface/tools/core/strings/converge.strings.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

type Case = readonly [string, readonly (number | string)[]];

const VENUE = "probe.01.blocking.md";

const unnamed = function unnamed(cases: readonly Case[]): string[] {
    return cases.flatMap(([message, operands]) =>
        operands.map(String).flatMap((operand) => (message.includes(operand) ? [] : [`${message} lacks ${operand}`])),
    );
};

describe("the converge command's messages", () => {
    it("name the venue, the seat, the archive name and the failure", () => {
        const cases: Case[] = [
            [moveFailed(VENUE, "EPERM"), [VENUE, "EPERM"]],
            [rosterContended(VENUE), [VENUE]],
            [signOffContended(VENUE), [VENUE]],
            [signatureContended(VENUE), [VENUE]],
            [convergeHelp("npm run converge"), ["npm run converge"]],
            [convergeNotVenue("notes.md"), ["notes.md"]],
            [convergeAbsent(VENUE), [VENUE]],
            [orderingsBlock(2, 7, VENUE), [2, 7, VENUE]],
            [archiveRootMissing(VENUE), [VENUE]],
            [archiveNameTaken("probe.01.archived.md", VENUE), ["probe.01.archived.md", VENUE]],
            [convergePreview(VENUE, "A"), [VENUE, "A"]],
        ];
        assert.deepEqual(unnamed(cases), []);
    });
});

describe("the convergence edge details", () => {
    it("name the seats, headings, clauses and directives each edge judged", () => {
        const cases: Case[] = [
            [needsHold(2, ["C"]), [2, "C"]],
            [needsMissing(["A", "B"]), ["A", "B"]],
            [durableHold(["lost-update", "B → none"]), ["lost-update", "B → none"]],
            [durableUndeclared(["A"]), ["A"]],
            [durableUnresolved(["B → torn-write"]), ["B → torn-write"]],
            [successorScheduled("next"), ["next"]],
            [
                successorArrived("next.02.blocking.md", ["the audit"], ["the write"]),
                ["next.02.blocking.md", "the audit", "the write"],
            ],
            [deferredUndeclared("DEFERRED"), ["DEFERRED"]],
            [deferredUnanswered("DEFERRED"), ["DEFERRED"]],
            [successorMissing("INHERITED", "next"), ["INHERITED", "next"]],
            [unarrivedClauses(["the write"]), ["the write"]],
            [undischarged(["do the index"]), ["do the index"]],
            [unoriginated(["an invented clause"]), ["an invented clause"]],
        ];
        assert.deepEqual(unnamed(cases), []);
        assert.notEqual(successorArrived("next", [], []), successorArrived("next", [], ["the write"]));
    });
});
