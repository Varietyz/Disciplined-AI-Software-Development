import { fencedFlags } from "../predicates/fence.predicate.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const OUTSIDE = "OUTSIDE";

const NESTED = ["````", "an outer block", "```", "an inner sample", "```", "````", OUTSIDE].join("\n");

const PLAIN = ["```", "a block", "```", OUTSIDE].join("\n");

function fencing(source: string): BranchObservation {
    const flags = fencedFlags(source);
    const lines = source.split("\n");

    let at = -1;
    for (let index = 0; index < lines.length; index += 1) {
        if (lines[index] === OUTSIDE) at = index;
    }

    return { fenced: flags[at] === true, lines: flags.length };
}

export const FENCE_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "fence.predicate",
        branch: "a longer fence enclosing a shorter one, where a prefix toggle inverts every later line",
        seed: [],
        exercise: () => fencing(NESTED),
        expect: { fenced: false, lines: 7 },
    },
    {
        subject: "fence.predicate",
        branch: "a fence closed by its own run length",
        seed: [],
        exercise: () => fencing(PLAIN),
        expect: { fenced: false, lines: 4 },
    },
];
