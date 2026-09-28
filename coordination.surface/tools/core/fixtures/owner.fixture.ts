import { appendFileSync } from "node:fs";
import { resolve } from "node:path";

import { changesSince } from "../reporters/board.reporter.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const VENUE = "probe.blocking.md";

const OPENED = ["# a probe venue", "", "an argument in progress", ""].join("\n");

const ENTRY = "# Owner review: every seat keeps the retry limit at three";

function delivering(root: string, seats: readonly string[]): BranchObservation {
    const absolute = resolve(root, VENUE);

    for (const seat of seats) changesSince(root, absolute, seat, VENUE);

    appendFileSync(absolute, `${ENTRY}\n`, "utf8");

    let handed = 0;
    for (const seat of seats) {
        if (changesSince(root, absolute, seat, VENUE).includes(ENTRY)) handed += 1;
    }

    return { seats: seats.length, handed };
}

export const OWNER_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "board.reporter",
        branch: "an owner entry written into a venue after every seat last looked, which each seat's next wait hands to it",
        seed: [{ path: VENUE, text: OPENED }],
        exercise: (root) => delivering(root, ["A", "B", "C"]),
        expect: { seats: 3, handed: 3 },
    },
    {
        subject: "board.reporter",
        branch: "the same venue with no new entry, where a wait hands nothing so the owner's earlier entry is not repeated",
        seed: [{ path: VENUE, text: `${OPENED}${ENTRY}\n` }],
        exercise: (root) => {
            const absolute = resolve(root, VENUE);
            changesSince(root, absolute, "A", VENUE);
            return { seats: 1, handed: changesSince(root, absolute, "A", VENUE).includes(ENTRY) ? 1 : 0 };
        },
        expect: { seats: 1, handed: 0 },
    },
];
