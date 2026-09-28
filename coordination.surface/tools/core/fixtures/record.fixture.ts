import { recordSpecimen, seatRecord } from "../generators/venue.generator.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const SPECIMEN = [
    "**The specimen is FENCED so the scanners read it as a record MENTIONED rather than CLAIMED.**",
    "",
    "```",
    "┌─── AGENT <letter> ─── one writer: <letter> · others cite, never edit",
    "Agent <letter> — <ACTIVE | INACTIVE>",
    "  Reading: <how this seat reads the question this venue decides>",
    "  Stance:  <the outcome this seat argues for, in one line>",
    "  Needs:   <what must be answered before this seat can sign, or —>",
    "  Durable: <the accumulator heading THIS seat authored, or —>",
    "  Positions: —",
    "└─── END AGENT <letter>",
    "```",
    "",
].join("\n");

const INDENTED = [
    "```",
    "  ┌─── AGENT <letter> ─── one writer: <letter>",
    "  Agent <letter> — <ACTIVE | INACTIVE>",
    "    Needs:   <what must be answered before this seat can sign, or —>",
    "  └─── END AGENT <letter>",
    "```",
].join("\n");

function recordOf(template: string, letter: string): string[] {
    return seatRecord(recordSpecimen(template), letter);
}

function shaped(template: string, letter: string): BranchObservation {
    const record = recordOf(template, letter);

    return {
        opens: record.filter((line) => line.startsWith(`┌─── AGENT ${letter} `)).length,
        closes: record.filter((line) => line.startsWith(`└─── END AGENT ${letter}`)).length,
        slots: record.filter((line) => line.includes("<")).length,
    };
}

function emptied(template: string, letter: string): BranchObservation {
    return { needs: recordOf(template, letter).filter((line) => line.trim() === "Needs:").length };
}

export const RECORD_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "venue.runner",
        branch: "a declared participant seated from the template's own fenced specimen — the record shape is DERIVED rather than transcribed into the runner, so a template that moves its field set cannot leave the raise emitting a record the venue's own checks no longer accept, which is the drift a transcribed schema produces silently at the one moment its reader is least equipped to notice",
        seed: [],
        exercise: () => shaped(SPECIMEN, "F"),
        expect: { opens: 1, closes: 1, slots: 0 },
    },
    {
        subject: "venue.runner",
        branch: "the seated record's fields left EMPTY rather than carrying the absent marker — an empty field blocks convergence and a dash reads as a seat that considered the question and needs nothing, so seating participants with dashes would let a venue converge over seats that never looked while every ordering reported green",
        seed: [],
        exercise: () => emptied(SPECIMEN, "G"),
        expect: { needs: 1 },
    },
    {
        subject: "venue.runner",
        branch: "a specimen INDENTED inside its fence, where the emitted record loses the fence's indent and keeps its own field indent — a marker is recognized at line start after trimming, so an indented open registers while the block it opens is shaped differently from every other record, and stripping every leading space instead would collapse the fields into the header",
        seed: [],
        exercise: () => shaped(INDENTED, "F"),
        expect: { opens: 1, closes: 1, slots: 0 },
    },
    {
        subject: "venue.runner",
        branch: "a template carrying no fenced specimen at all, where the raise must produce NO record rather than a guessed one — a runner falling back to a transcribed shape here is the second copy of a contract the template owns, and it would land that copy in every venue raised from a template that had simply moved it",
        seed: [],
        exercise: () => ({ lines: recordSpecimen("no specimen anywhere in this document").length }),
        expect: { lines: 0 },
    },
];
