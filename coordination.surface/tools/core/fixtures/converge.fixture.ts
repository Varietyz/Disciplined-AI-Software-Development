import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { surfacePath } from "../../../config/surface.config.ts";
import { runArchiveMove } from "../runners/converge.runner.ts";
import { declaredHeading, headingIsWhole } from "../analyzers/converge.analyzer.ts";
import { absorptionState } from "../resolvers/converge.resolver.ts";
import { convergenceEdges } from "../validators/converge.validator.ts";
import { unoriginatedInheritance } from "../resolvers/venue.resolver.ts";
import { disorderedRows } from "../readers/agenda.reader.ts";

const SCHEDULE_HEAD = "| planned | invariant | what it must establish | state |\n|---|---|---|---|\n";

function schedule(rows: readonly string[]): string {
    return SCHEDULE_HEAD + rows.map((row) => `${row}\n`).join("");
}
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const ARCHIVE = "archive";

const VENUE = "one.blocking.md";

const OCCUPIED = "two.blocking.md";

const UNROOTED = "three.blocking.md";

const BODY = "venue body\n";

function observe(root: string, source: string, destination: string, label: string): BranchObservation {
    const from = resolve(root, source);
    const to = resolve(root, destination);
    const outcome = runArchiveMove(from, to, label);
    return { code: outcome.code, sourceRemoved: !existsSync(from), destinationPresent: existsSync(to) };
}

const DEFERRING = "## DEFERRED — what this venue leaves open\n\n- a-carried-clause → B\n";

const SEEDED = "## DEFERRED — what this venue leaves open\n\n- <one name per line, each seat adds its own>\n";

const INHERITING = "═══ INHERITED (from the predecessor) ═══\n\n- **a-carried-clause** → B, with its reason\n";

const INHERITING_UNDEFERRED = "═══ INHERITED (from the predecessor) ═══\n\n- **a-clause-nobody-deferred** → B\n";

const VENUE_NAME = "probe.blocking.md";

const PLANNING = surfacePath("planning");

const OPEN_CHECKLIST =
    `DISTRIBUTES: ${VENUE_NAME}\n\n- [ ] 1.1.1 do the work\n\n### Phase Execution Gate\n\n- [ ] Run the verify command\n`;

const CLOSED_CHECKLIST = `DISTRIBUTES: ${VENUE_NAME}\n\n### Phase Execution Gate\n\n- [ ] Run the verify command\n`;

const UNDECLARED_CHECKLIST = "- [ ] 1.1.1 do the work\n";

function heading(field: string): BranchObservation {
    return { named: declaredHeading(field), whole: headingIsWhole(field) };
}

export const BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "converge.validator",
        branch: "a durable field carrying its heading AND the statement that heading stands for, which is the PAYLOAD-IN-CARRIER shape and must NOT resolve — a recovery consuming the leading heading characters and stopping passes exactly this field, so the defect is caught only where the payload displaces the carrier rather than follows it",
        seed: [],
        exercise: () => heading("a-class-naming-what-recurs — the members it covers, stated so a reader can act"),
        expect: {
            named: "a-class-naming-what-recurs — the members it covers, stated so a reader can act",
            whole: false,
        },
    },
    {
        subject: "converge.validator",
        branch: "a durable field carrying its heading and NOTHING else, which is the positive control — a comparison rejecting every field would refuse the correct value too, and the field's declared content is a heading rather than a heading with commentary",
        seed: [],
        exercise: () => heading("a-class-naming-what-recurs"),
        expect: { named: "a-class-naming-what-recurs", whole: true },
    },
    {
        subject: "converge.validator",
        branch: "absorption blocked by an open distribution item",
        seed: [{ path: `${PLANNING}/probe.checklist.md`, text: OPEN_CHECKLIST }],
        exercise: (root: string): BranchObservation => {
            const state = absorptionState(root, VENUE_NAME);
            return { declared: state !== null, open: state === null ? "" : state.open.join(", ") };
        },
        expect: { declared: true, open: "1.1.1" },
    },
    {
        subject: "converge.validator",
        branch: "absorption holds once every distribution item is closed",
        seed: [{ path: `${PLANNING}/probe.checklist.md`, text: CLOSED_CHECKLIST }],
        exercise: (root: string): BranchObservation => {
            const state = absorptionState(root, VENUE_NAME);
            return { declared: state !== null, open: state === null ? "" : state.open.join(", ") };
        },
        expect: { declared: true, open: "" },
    },
    {
        subject: "converge.validator",
        branch: "no planning surface distributes the venue",
        seed: [{ path: `${PLANNING}/probe.checklist.md`, text: UNDECLARED_CHECKLIST }],
        exercise: (root: string): BranchObservation => ({ declared: absorptionState(root, VENUE_NAME) !== null }),
        expect: { declared: false },
    },
    {
        subject: "converge.validator",
        branch: "a venue no seat is party to, where the three seat edges are FILTERS over an empty set and would each hold vacuously — reported as failing, because a pass measuring nothing is uniform by construction and its own greenness becomes the evidence that what it measures is working",
        seed: [],
        exercise: (root: string): BranchObservation => {
            const edges = convergenceEdges(root, VENUE_NAME, "", "", "", "", []);
            const seat = edges.filter((edge) => ["needs", "signatures", "durable"].includes(edge.step));
            return { seatEdges: seat.length, holding: seat.filter((edge) => edge.holds).length };
        },
        expect: { seatEdges: 3, holding: 0 },
    },
    {
        subject: "venue.runner",
        branch: "a PLAIN-numbered schedule row sitting after a higher one, which states nothing its position does not already state and contradicts it for nothing — one column carrying two facts, with the row's own ordinal as the tiebreak because that is a claim its author wrote where the position is a consequence of where it was appended",
        seed: [],
        exercise: () => ({
            disordered: disorderedRows(schedule(["| 1 | `a-first` | x | planned |", "| 2 | `a-second` | x | planned |", "| 1 | `a-third` | x | planned |"]))
                .map((row) => row.invariant)
                .join(","),
        }),
        expect: { disordered: "a-third" },
    },
    {
        subject: "venue.runner",
        branch: "a LETTERED row sitting out of the order its own ordinal states, which FIRES — a letter is itself a sequence claim recording the predecessor it was declared under, so it says where the row belongs rather than exempting it from belonging anywhere",
        seed: [],
        exercise: () => ({
            disordered: disorderedRows(schedule(["| 1 | `a-first` | x | planned |", "| 6 | `a-sixth` | x | planned |", "| 2a | `an-inserted` | x | planned |"]))
                .map((row) => row.invariant)
                .join(","),
        }),
        expect: { disordered: "an-inserted" },
    },
    {
        subject: "venue.runner",
        branch: "a lettered row APPENDED LATE and sitting at its own ordinal, which clears — append order is the one thing a letter is licensed to differ from, and a lettered ordinal sorts between its own number and the next rather than being skipped",
        seed: [],
        exercise: () => ({
            disordered: disorderedRows(schedule(["| 1 | `a-first` | x | planned |", "| 2a | `an-inserted` | x | planned |", "| 6 | `a-sixth` | x | planned |"]))
                .map((row) => row.invariant)
                .join(","),
        }),
        expect: { disordered: "" },
    },
    {
        subject: "venue.runner",
        branch: "a lettered row skipped rather than ordered, which would be invisible in BOTH directions — it could neither fail nor constrain any row after it, so a later out-of-order row would pass against a baseline the skip never updated",
        seed: [],
        exercise: () => ({
            disordered: disorderedRows(schedule(["| 6a | `an-inserted` | x | planned |", "| 2 | `a-second` | x | planned |"]))
                .map((row) => row.invariant)
                .join(","),
        }),
        expect: { disordered: "a-second" },
    },
    {
        subject: "converge.validator",
        branch: "inheritance agrees with the deferred set",
        seed: [],
        exercise: (): BranchObservation => ({
            unoriginated: unoriginatedInheritance(DEFERRING, INHERITING).join(", "),
        }),
        expect: { unoriginated: "" },
    },
    {
        subject: "converge.validator",
        branch: "the successor inherits a clause nobody deferred",
        seed: [],
        exercise: (): BranchObservation => ({
            unoriginated: unoriginatedInheritance(DEFERRING, INHERITING_UNDEFERRED).join(", "),
        }),
        expect: { unoriginated: "a-clause-nobody-deferred" },
    },
    {
        subject: "converge.validator",
        branch: "a seeded deferred section originates nothing",
        seed: [],
        exercise: (): BranchObservation => ({
            unoriginated: unoriginatedInheritance(SEEDED, INHERITING).join(", "),
        }),
        expect: { unoriginated: "a-carried-clause" },
    },
    {
        subject: "converge.runner",
        branch: "move",
        seed: [
            { path: VENUE, text: BODY },
            { path: `${ARCHIVE}/seed.md`, text: BODY },
        ],
        exercise: (root: string): BranchObservation => observe(root, VENUE, `${ARCHIVE}/${VENUE}`, VENUE),
        expect: { code: 0, sourceRemoved: true, destinationPresent: true },
    },
    {
        subject: "converge.runner",
        branch: "occupied destination",
        seed: [
            { path: OCCUPIED, text: BODY },
            { path: `${ARCHIVE}/${OCCUPIED}`, text: BODY },
        ],
        exercise: (root: string): BranchObservation => observe(root, OCCUPIED, `${ARCHIVE}/${OCCUPIED}`, OCCUPIED),
        expect: { code: 2, sourceRemoved: false, destinationPresent: true },
    },
    {
        subject: "converge.runner",
        branch: "absent archive root",
        seed: [{ path: UNROOTED, text: BODY }],
        exercise: (root: string): BranchObservation => observe(root, UNROOTED, `${ARCHIVE}/${UNROOTED}`, UNROOTED),
        expect: { code: 2, sourceRemoved: false, destinationPresent: false },
    },
];
