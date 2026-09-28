import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { activeSeats } from "../analyzers/board.analyzer.ts";
import { writingSeats } from "../coordinators/board.coordinator.ts";
import { claimStanding } from "../registries/claim.registry.ts";
import { activeSeatLetters, indexedLetters } from "../inspectors/index.inspector.ts";
import { runIndex, runTransition } from "../runners/index.runner.ts";
import { writeSnapshot } from "../registries/snapshot.registry.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const INDEX = "probe-index.md";

const MARKED_ACTIVE = [
    "┌─── AGENT A ───",
    "Agent A — ACTIVE",
    "  Owns: a declared concern",
    "└─── END AGENT A",
    "",
].join("\n");

function derived(index: string): BranchObservation {
    const seats = activeSeats(MARKED_ACTIVE, index);
    return { seats: seats.length, holds: seats.includes("A") };
}

const REGIONED = [
    "# a probe index",
    "",
    "═══ INDEX ═══",
    "",
    "| letter | role | state |",
    "|---|---|---|",
    "| A | a declared concern | ACTIVE |",
    "",
    "═══ ALLOCATION ═══",
    "",
    "prose below the region",
    "",
].join("\n");

const NO_REGION = ["# a probe index", "", "| letter | role | state |", "| A | a declared concern | ACTIVE |", ""].join(
    "\n",
);

function indexing(root: string, seed: string, role: string): BranchObservation {
    const absolute = resolve(root, INDEX);
    const before = readFileSync(absolute, "utf8");
    const outcome = runIndex({ absolute, role });
    const after = readFileSync(absolute, "utf8");

    return {
        code: outcome.code,
        changed: after !== before,
        letters: indexedLetters(after).letters.size,
        active: activeSeatLetters(after).length,
        seeded: seed.length > 0,
    };
}

function moving(
    root: string,
    letter: string,
    state: string,
    by = letter,
    warrant: string | null = null,
): BranchObservation {
    const absolute = resolve(root, INDEX);
    const outcome = runTransition({ absolute, letter, state, by, warrant });
    const after = readFileSync(absolute, "utf8");

    return {
        code: outcome.code,
        active: activeSeatLetters(after).length,
        letters: indexedLetters(after).letters.size,
        reads: after.includes(`| ${letter} | a declared concern | ${state} |`),
        attributed: after.includes(`moved to ${state} by ${by} under`),
    };
}

const INDEX_INACTIVE = REGIONED.split("| A | a declared concern | ACTIVE |").join(
    "| A | a declared concern | INACTIVE |",
);

export const INDEX_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "board.analyzer",
        branch: "a board marker reading active against an index row reading inactive, where the maintained operand decides",
        seed: [{ path: INDEX, text: INDEX_INACTIVE }],
        exercise: () => derived(INDEX_INACTIVE),
        expect: { seats: 0, holds: false },
    },
    {
        subject: "board.analyzer",
        branch: "a board marker and an index row that agree, which every derived set reads exactly as it reads today",
        seed: [{ path: INDEX, text: REGIONED }],
        exercise: () => derived(REGIONED),
        expect: { seats: 1, holds: true },
    },
    {
        subject: "board.analyzer",
        branch: "a letter the allocating surface does not bind, where trusting its own marker would make an unallocated identity active on its own say-so",
        seed: [{ path: INDEX, text: REGIONED }],
        exercise: () => derived("| letter | role | state |\n"),
        expect: { seats: 0, holds: false },
    },
    {
        subject: "board.analyzer",
        branch: "an ABSENT allocating surface, which is a different state from one that binds nothing — there is no allocation to derive from, so the branch that would read one does not run and the marker stands",
        seed: [],
        exercise: () => derived(""),
        expect: { seats: 1, holds: true },
    },
    {
        subject: "index.runner",
        branch: "a seat moving its own row to a declared state, which every keyed mechanism re-derives from",
        seed: [{ path: INDEX, text: REGIONED }],
        exercise: (root) => moving(root, "A", "INACTIVE"),
        expect: { code: 0, active: 0, letters: 1, reads: true, attributed: false },
    },
    {
        subject: "index.runner",
        branch: "a seat moving ANOTHER seat's row with a warrant, which is the case the self-scoped form has none for — a seat that departs without declaring leaves a state only it may change, so every edge quantifying over active seats counts a party that cannot act and the discussion holds on a signature that will never arrive",
        seed: [{ path: INDEX, text: REGIONED }],
        exercise: (root) => moving(root, "A", "INACTIVE", "D", "the warrant"),
        expect: { code: 0, active: 0, letters: 1, reads: true, attributed: true },
    },
    {
        subject: "index.runner",
        branch: "the same foreign transition with NO warrant, which must refuse — a state a peer wrote and a state its own seat wrote are otherwise one cell, and no reader can tell which claim they are holding",
        seed: [{ path: INDEX, text: REGIONED }],
        exercise: (root) => moving(root, "A", "INACTIVE", "D"),
        expect: { code: 2, active: 1, letters: 1, reads: false, attributed: false },
    },
    {
        subject: "index.runner",
        branch: "a transition to a state outside the closed set, which would resolve in no reader of the column",
        seed: [{ path: INDEX, text: REGIONED }],
        exercise: (root) => moving(root, "A", "RESTING"),
        expect: { code: 2, active: 1, letters: 1, reads: false, attributed: false },
    },
    {
        subject: "index.runner",
        branch: "a transition on a letter the index does not bind, which would state a seat nothing resolves",
        seed: [{ path: INDEX, text: REGIONED }],
        exercise: (root) => moving(root, "Q", "INACTIVE"),
        expect: { code: 2, active: 1, letters: 1, reads: false, attributed: false },
    },
    {
        subject: "index.runner",
        branch: "a binding into a declared row region, which allocates the shortest free identity",
        seed: [{ path: INDEX, text: REGIONED }],
        exercise: (root) => indexing(root, REGIONED, "a second declared concern"),
        expect: { code: 0, changed: true, letters: 2, active: 2, seeded: true },
    },
    {
        subject: "index.runner",
        branch: "a binding against a surface declaring no row region, which has no boundary to append within",
        seed: [{ path: INDEX, text: NO_REGION }],
        exercise: (root) => indexing(root, NO_REGION, "a second declared concern"),
        expect: { code: 2, changed: false, letters: 1, active: 1, seeded: true },
    },
    {
        subject: "index.runner",
        branch: "a binding naming no role, which would resolve every citation of its letter to nothing",
        seed: [{ path: INDEX, text: REGIONED }],
        exercise: (root) => indexing(root, REGIONED, "   "),
        expect: { code: 2, changed: false, letters: 1, active: 1, seeded: true },
    },
    {
        subject: "board.coordinator",
        branch: "a seated party that has touched a coordination surface just now, which is able to write and raises the threshold it should",
        seed: [],
        exercise: (root) => {
            writeSnapshot(root, "A", "a-surface.md", "held");
            return { able: writingSeats(root, ["A", "B"], [], Date.now()).join("") };
        },
        expect: { able: "A" },
    },
    {
        subject: "board.coordinator",
        branch: "a seated party currently PARKED, which is live by construction and counted whatever its last stamp says — the half a recency signal alone would drop, since a parked party stops stamping while it waits",
        seed: [],
        exercise: (root) => ({ able: writingSeats(root, ["A", "B"], ["B"], Date.now()).join("") }),
        expect: { able: "B" },
    },
    {
        subject: "board.coordinator",
        branch: "a seated party that has neither parked nor touched anything inside the declared window, which raises the threshold for nobody — the deadlock member, where a party counted by holding a row lets every remaining one park with nobody left to write",
        seed: [],
        exercise: (root) => ({ able: writingSeats(root, ["A", "B"], [], 0).join("") }),
        expect: { able: "" },
    },
    {
        subject: "board.coordinator",
        branch: "a seated party holding a LIVE RUN CLAIM and nothing else, which must be counted — liveness was measured by touching a coordination surface, which is the one activity a party deep in a build does not perform, so the longer it worked the more certainly it dropped out and the denominator fell to one, refusing every wait unconditionally while asserting that every peer was parked",
        seed: [],
        exercise: (root) => {
            claimStanding(root, "whole", 1, "B");
            return { able: writingSeats(root, ["A", "B"], [], 0).join("") };
        },
        expect: { able: "B" },
    },
];
