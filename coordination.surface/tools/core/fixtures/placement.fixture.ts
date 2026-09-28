import { surfacePath } from "../../../config/surface.config.ts";
import { isImmutable } from "../predicates/placement.predicate.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

function immutable(slot: string, tail: string): BranchObservation {
    return { skipped: isImmutable(`${surfacePath(slot)}/${tail}`) };
}

export const PLACEMENT_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "placement.rule",
        branch: "a surface declaring FROZEN with removal authority NONE, whose only computed repair nobody may perform",
        seed: [],
        exercise: () => immutable("venue_archive", "a-converged-venue.blocking.md"),
        expect: { skipped: true },
    },
    {
        subject: "placement.rule",
        branch: "a surface declaring FROZEN whose PRODUCER may remove, so the same repair stays reachable",
        seed: [],
        exercise: () => immutable("generated", "a.report.generated.json"),
        expect: { skipped: false },
    },
];
