import {
    arrivalContended,
    arrivalSettled,
    arriveSectionEmpty,
    defersAlready,
    inheritContended,
    markerContended,
    raiseDestinationTaken,
    raiseNotAdmissible,
    raiseOrdinalMissing,
    raiseSuccessorUndeclared,
    raiseUnbound,
    recordAdded,
    recordAnchorMissing,
    recordContended,
    recordExists,
    recordSurfaceMissing,
    recordTemplateEmpty,
    recordTemplateMissing,
    relocateMismatch,
    retireContended,
    rosterContended,
    successorContended,
    successorDeclared,
    successorSectionMissing,
} from "coordination-surface/tools/core/strings/venue.strings.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

type Case = readonly [string, readonly (number | string)[]];

const VENUE = "probe.01.blocking.md";

const SUCCESSOR = "next.02.blocking.md";

const unnamed = function unnamed(cases: readonly Case[]): string[] {
    return cases.flatMap(([message, operands]) =>
        operands.map(String).flatMap((operand) => (message.includes(operand) ? [] : [`${message} lacks ${operand}`])),
    );
};

describe("the record messages", () => {
    it("name the surface, the seat, the kind and the fields", () => {
        const cases: Case[] = [
            [recordSurfaceMissing(VENUE), [VENUE]],
            [recordExists("A", VENUE), ["A", VENUE]],
            [recordTemplateMissing("venue"), ["venue"]],
            [recordTemplateEmpty("board"), ["board"]],
            [recordAnchorMissing(VENUE), [VENUE]],
            [recordContended(VENUE), [VENUE]],
            [recordAdded("A", VENUE, ["Needs", "Durable"]), ["A", VENUE, 2, "Needs", "Durable"]],
        ];
        assert.deepEqual(unnamed(cases), []);
    });
});

describe("the venue lifecycle messages", () => {
    it("name the venue, the invariant, the seats and the counts", () => {
        const cases: Case[] = [
            [successorSectionMissing(VENUE), [VENUE]],
            [successorContended(VENUE), [VENUE]],
            [successorDeclared(VENUE, "next"), [VENUE, "next"]],
            [defersAlready(VENUE, 2), [VENUE, 2]],
            [markerContended(VENUE), [VENUE]],
            [arrivalSettled(VENUE, SUCCESSOR), [VENUE, SUCCESSOR]],
            [arriveSectionEmpty(SUCCESSOR), [SUCCESSOR]],
            [arrivalContended(SUCCESSOR), [SUCCESSOR]],
            [rosterContended(VENUE), [VENUE]],
            [inheritContended(VENUE), [VENUE]],
            [retireContended("checklists/index.checklist.md"), ["checklists/index.checklist.md"]],
            [relocateMismatch(VENUE), [VENUE]],
            [raiseNotAdmissible("later", ["next", "other"]), ["later", "next", "other"]],
            [raiseSuccessorUndeclared([VENUE]), [VENUE]],
            [raiseOrdinalMissing("next"), ["next"]],
            [raiseDestinationTaken(SUCCESSOR), [SUCCESSOR]],
            [raiseUnbound(["Z"]), ["Z"]],
        ];
        assert.deepEqual(unnamed(cases), []);
    });
});
