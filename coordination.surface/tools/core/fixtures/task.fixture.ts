import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { PLANNING_TEMPLATE } from "../constants/checklist.constants.ts";
import { readRowMarkers } from "../readers/template.reader.ts";
import { runTask } from "../runners/task.runner.ts";
import { inspectProtocol } from "../inspectors/checklist.inspector.ts";
import { emptyPhases } from "../validators/checklist.validator.ts";

const SCAFFOLD = ["S:", "L:", "D:", "P:", "RIPPLE", "GENESIS"];

const CONTRACT = {
    genesisStages: ["conception"],
    rippleDimensions: ["surface"],
    dependencyAxes: ["axis_s"],
    confidenceThreshold: 1,
};
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const PLAN = "probe.checklist.md";

const ROWS = ["## Phase", "", "- [ ] 1.1.1 an existing row — owner: Z", ""].join("\n");

const NO_ROWS = ["## Phase", "", "prose with no task row", ""].join("\n");

const CONTRACT_TABLE = [
    "| field | states | rendered as | omitted means |",
    "|---|---|---|---|",
    "| locus | the file the row acts on | `*file:*` | an inferred target |",
    "| owner | the party that does it | `*owner:*` | a row nobody picks up |",
    "| done when | the testable condition | `*done:*` | a row that closes when it feels finished |",
    "",
].join("\n");

const TEMPLATE_SEED = { path: PLANNING_TEMPLATE, text: CONTRACT_TABLE };

function appending(root: string, id: string, statement: string): BranchObservation {
    const outcome = runTask({ repoRoot: root, target: PLAN, id, statement, owner: "Z" });
    const after = readFileSync(resolve(root, PLAN), "utf8");

    const declared = readRowMarkers(CONTRACT_TABLE);
    const added = after.split("\n").filter((line) => line.startsWith("- [ ] ") && !ROWS.includes(line));

    return {
        code: outcome.code,
        rows: after.split("\n").filter((line) => line.startsWith("- [ ] ")).length,
        contract: added.length === 1 && declared.every((marker) => (added[0] ?? "").includes(marker)),
    };
}

export const TASK_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "checklist.inspector",
        branch: "a RAISED surface, which names no distribution and is exempt from the phase contract as a WHOLE — the discriminator is the surface rather than the span, because emptiness is exactly what a raised surface and a NEGLECTED phase have in common and no predicate reading the span alone can separate them",
        seed: [],
        exercise: () => ({
            raised: inspectProtocol(["### PHASE one", "", "### PHASE two", ""], CONTRACT).filter((finding) =>
                ["axesMissing", "rippleMissing", "genesisMissing"].includes(finding.kind),
            ).length,
        }),
        expect: { raised: 0 },
    },
    {
        subject: "checklist.inspector",
        branch: "a surface PUT TO WORK carrying one phase with only its heading, which is the case a span-level skip exempts wrongly — total absence is the strongest instance of what these rules require, so it fires here and the motivating case survives the scoping",
        seed: [],
        exercise: () => ({
            raised: inspectProtocol(
                ["DISTRIBUTES: a-venue.blocking.md", "", "### PHASE one", "", "### PHASE two", ""],
                CONTRACT,
            ).filter((finding) => ["axesMissing", "rippleMissing", "genesisMissing"].includes(finding.kind)).length,
        }),
        expect: { raised: 6 },
    },
    {
        subject: "checklist.inspector",
        branch: "a phase whose genesis line names no declared stage while a RIPPLE line elsewhere in the span contains one as a substring — the check reads the genesis LINE and matches at a word boundary, so it cannot be satisfied by a mandatory line it was never about",
        seed: [],
        exercise: () => ({
            raised: inspectProtocol(
                [
                    "DISTRIBUTES: a-venue.blocking.md",
                    "",
                    "### PHASE one",
                    "S: none  L: none  D: none  P: none",
                    "genesis: unstated",
                    "ripple: surface reconception",
                    "",
                ],
                CONTRACT,
            ).filter((finding) => finding.kind === "genesisMissing").length,
        }),
        expect: { raised: 1 },
    },
    {
        subject: "checklist.validator",
        branch: "a phase carrying ONLY the labels its own contract mandates, which is scaffolding rather than an argument — the state a raise produces, and the exclusion set is DERIVED from the same contract read the phase checks use so a template gaining a dimension cannot make a seed non-conformant at birth",
        seed: [],
        exercise: () => ({
            breached: emptyPhases(["### PHASE one", "", "S: none  L: none  D: none  P: none", ""], SCAFFOLD).length,
        }),
        expect: { breached: 0 },
    },
    {
        subject: "checklist.validator",
        branch: "a phase carrying its scaffolding PLUS one sentence, which is the case separating an EXCLUSION from a blanket permission — without it the predicate cannot be shown to discriminate rather than to admit",
        seed: [],
        exercise: () => ({
            breached: emptyPhases(
                ["### PHASE one", "", "S: none  L: none  D: none  P: none", "an argument nobody will close", ""],
                SCAFFOLD,
            ).length,
        }),
        expect: { breached: 1 },
    },
    {
        subject: "checklist.validator",
        branch: "a phase carrying an ARGUMENT and no row, which is the motivating case re-run after the narrowing — a phase asking for something no row will ever close",
        seed: [],
        exercise: () => ({ breached: emptyPhases(["### PHASE one", "", "an argument no row will close", ""]).length }),
        expect: { breached: 1 },
    },
    {
        subject: "checklist.validator",
        branch: "a SCAFFOLDED phase carrying its heading and nothing else, which states an intended cycle and asks a reader for nothing — the state a raise produces, where reporting it would fail every raised surface once per phase from a seed that reads as authoritative",
        seed: [],
        exercise: () => ({ breached: emptyPhases(["### PHASE one", "", "### PHASE two", ""]).length }),
        expect: { breached: 0 },
    },
    {
        subject: "checklist.validator",
        branch: "a phase carrying a row, which is the ordinary case and stays clear whatever else it holds",
        seed: [],
        exercise: () => ({
            breached: emptyPhases(["### PHASE one", "", "an argument", "- [ ] 1.1.1 a row — owner: Z", ""]).length,
        }),
        expect: { breached: 0 },
    },
    {
        subject: "task.runner",
        branch: "a row appended carrying every contract field the template declares, derived rather than transcribed",
        seed: [{ path: PLAN, text: ROWS }, TEMPLATE_SEED],
        exercise: (root) => appending(root, "1.1.2", "the work this row asks for"),
        expect: { code: 0, rows: 2, contract: true },
    },
    {
        subject: "task.runner",
        branch: "a planning template declaring no row fields, where the form has no contract to write a row from",
        seed: [{ path: PLAN, text: ROWS }, { path: PLANNING_TEMPLATE, text: "a template with no contract table\n" }],
        exercise: (root) => appending(root, "1.1.2", "the work this row asks for"),
        expect: { code: 2, rows: 1, contract: false },
    },
    {
        subject: "task.runner",
        branch: "an id that already declares a row, which would make every citation of it ambiguous with no error anywhere",
        seed: [{ path: PLAN, text: ROWS }, TEMPLATE_SEED],
        exercise: (root) => appending(root, "1.1.1", "a second row under one id"),
        expect: { code: 2, rows: 1, contract: false },
    },
    {
        subject: "task.runner",
        branch: "a row naming no statement, which is a citation target that asks nothing",
        seed: [{ path: PLAN, text: ROWS }, TEMPLATE_SEED],
        exercise: (root) => appending(root, "1.1.2", "   "),
        expect: { code: 2, rows: 1, contract: false },
    },
    {
        subject: "task.runner",
        branch: "a surface carrying no task row, which gives the append no region and would place a row at the file's end",
        seed: [{ path: PLAN, text: NO_ROWS }, TEMPLATE_SEED],
        exercise: (root) => appending(root, "1.1.2", "the work this row asks for"),
        expect: { code: 2, rows: 0, contract: false },
    },
];
