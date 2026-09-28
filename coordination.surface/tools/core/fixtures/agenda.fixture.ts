import { oneLine, renderSchedule } from "../formatters/agenda.formatter.ts";
import { scheduleBounds } from "../transformers/agenda.transformer.ts";
import type { ScheduleReading } from "../types/agenda.types.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const BROKEN: ScheduleReading = {
    plan: {
        ordinal: "1",
        invariant: "a-probe-invariant",
        establishes: "what it must establish, carried across\ntwo lines by the body it arrived in.\n",
    },
    state: "planned",
    derived: true,
    evidence: "neither listing holds a venue for it",
};

const NOTED: ScheduleReading = {
    plan: {
        ordinal: "2",
        invariant: "a-second-probe-invariant",
        establishes: "what it must establish",
        note: "the reason it stands where it does,\nwrapped by its author.",
    },
    state: "planned",
    derived: true,
    evidence: "neither listing holds a venue for it",
};

function rendered(readings: readonly ScheduleReading[]): BranchObservation {
    const lines = renderSchedule(readings);
    const bounds = scheduleBounds(lines);

    return { rows: lines.length, spans: bounds === null ? 0 : bounds.to - bounds.from + 1 };
}

export const AGENDA_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "agenda.runner",
        branch: "a plan value carrying a line break, rendered into a table row — a row is ONE LINE by contract, so a value spanning two produces a row the drift comparison can never align and a heal that lands and then fails its own re-check, converging never; the render owns the guarantee rather than the writer, because normalizing on write covers only what the form wrote and leaves every hand edit able to reopen it",
        seed: [],
        exercise: () => rendered([BROKEN]),
        expect: { rows: 3, spans: 3 },
    },
    {
        subject: "agenda.runner",
        branch: "a break inside the NOTE rather than the establishing clause, which reaches the table through a different cell composer — a normalization applied at one call site and not its neighbor is the asymmetry that leaves a second entry point open while the first reads as fixed",
        seed: [],
        exercise: () => rendered([NOTED]),
        expect: { rows: 3, spans: 3 },
    },
    {
        subject: "agenda.runner",
        branch: "a value already on one line, which must pass through unchanged — a normalizer proven only on the broken input has been shown to rewrite rather than to discriminate, and its first green over a clean plan is indistinguishable from one that mangles every row",
        seed: [],
        exercise: () => ({ text: oneLine("what it must establish") }),
        expect: { text: "what it must establish" },
    },
];
