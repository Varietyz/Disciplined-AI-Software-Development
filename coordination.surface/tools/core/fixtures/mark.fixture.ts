import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { authorOf, markedReaders, runMark, unmarkedReaders } from "../runners/mark.runner.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";
import { positionFieldLabels } from "../validators/venue.validator.ts";

const POSITION_SCHEMA = [
    "Each position the tool posts lands inside that record as a fenced item, and carries these fields:",
    "",
    "  Position <address><n> — <one-line claim>",
    "    Axis:     <the design question this addresses>",
    "    Evidence: <observation anyone can reproduce>",
    "    Proposes: <the concrete mechanism>",
    "    Costs:    <what it makes harder>",
    "    Contradicts: <the position id this one argues against>",
    "    Signed:   <the author's own letter>",
    "",
].join("\n");

const SURFACE = "probe.board.md";

const RECORD = [
    "┌─── AGENT A ───",
    "Agent A — ACTIVE",
    "  Flags:   —",
    "           ┌─── AGENT A-1 ─── kind:judgement at:1000 to:B,C",
    "           To B AND C — a governing change every named seat must hold.",
    "           └─── END AGENT A-1",
    "└─── END AGENT A",
].join("\n");

function marking(root: string, agent: string, item: string): BranchObservation {
    const absolute = resolve(root, SURFACE);
    const outcome = runMark({ target: SURFACE, absolute, item, agent });
    const after = readFileSync(absolute, "utf8");

    const marker = after.split("\n").find((line) => line.includes(`AGENT ${item} ───`)) ?? "";

    return {
        code: outcome.code,
        readers: markedReaders(marker).length,
        held: unmarkedReaders(marker, ["B", "C"], ["B", "C"]).length,
    };
}

function holding(marker: string, addressed: readonly string[], active: readonly string[]): BranchObservation {
    return { code: 0, readers: 0, held: unmarkedReaders(marker, addressed, active).length };
}

export const MARK_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "mark.runner",
        branch: "a named recipient marking its own letter, which leaves the other recipient holding the item open",
        seed: [{ path: SURFACE, text: RECORD }],
        exercise: (root) => marking(root, "B", "A-1"),
        expect: { code: 0, readers: 1, held: 1 },
    },
    {
        subject: "mark.runner",
        branch: "a party the item never addressed, whose mark would satisfy a drain for a seat never sent the change",
        seed: [{ path: SURFACE, text: RECORD }],
        exercise: (root) => marking(root, "D", "A-1"),
        expect: { code: 2, readers: 0, held: 2 },
    },
    {
        subject: "mark.runner",
        branch: "a recipient that has gone inactive, which drops out of the drain because it can no longer act",
        seed: [],
        exercise: () => holding("┌─── AGENT A-1 ─── kind:judgement at:1000 to:B,C read:B", ["B", "C"], ["B"]),
        expect: { code: 0, readers: 0, held: 0 },
    },
    {
        subject: "mark.runner",
        branch: "an item addressed to EVERY seat, whose author is not a recipient of its own delivery",
        seed: [],
        exercise: () => ({
            code: 0,
            readers: 0,
            held: unmarkedReaders("┌─── AGENT B-1 ─── kind:judgement at:1000 to:*", [], ["A", "B"], authorOf("B-1"))
                .length,
        }),
        expect: { code: 0, readers: 0, held: 1 },
    },
    {
        subject: "mark.runner",
        branch: "the same item once its one other recipient marks, which drains rather than waiting on its author",
        seed: [],
        exercise: () => ({
            code: 0,
            readers: 0,
            held: unmarkedReaders(
                "┌─── AGENT B-1 ─── kind:judgement at:1000 to:* read:A",
                [],
                ["A", "B"],
                authorOf("B-1"),
            ).length,
        }),
        expect: { code: 0, readers: 0, held: 0 },
    },
    {
        subject: "venue.validator",
        branch: "the position field labels DERIVED from the venue template's own schema block, with the signature excluded because an item on either surface carries one — so a schema gaining a field is matched with no edit to the party that reads it",
        seed: [],
        exercise: () => ({ labels: positionFieldLabels(POSITION_SCHEMA).join(",") }),
        expect: { labels: "Axis,Evidence,Proposes,Costs,Contradicts" },
    },
    {
        subject: "venue.validator",
        branch: "a template declaring no schema block, where the derivation yields nothing rather than a guessed set — a refusal keyed on an invented vocabulary would fire on whatever its author happened to imagine",
        seed: [],
        exercise: () => ({ labels: positionFieldLabels("# a template with no position schema\n").join(",") }),
        expect: { labels: "" },
    },
];
