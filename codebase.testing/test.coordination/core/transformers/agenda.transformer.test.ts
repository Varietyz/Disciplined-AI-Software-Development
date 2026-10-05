import { SCHEDULE_DIVIDER, SCHEDULE_HEADER } from "coordination-surface/tools/core/constants/agenda.constants.ts";
import { describe, it } from "vitest";
import {
    driftedRows,
    healSchedule,
    scheduleBounds,
} from "coordination-surface/tools/core/transformers/agenda.transformer.ts";
import assert from "node:assert/strict";
import { sameRow } from "coordination-surface/tools/core/normalizers/document.normalizer.ts";

const RENDERED = [SCHEDULE_HEADER, SCHEDULE_DIVIDER, "| 1 | `a` | b | planned |"];

const FORMATTED = [
    "prose",
    "",
    "| planned | invariant | what it must establish | state   |",
    "| ------- | --------- | ---------------------- | ------- |",
    "| 1       | `a`       | b                      | planned |",
    "",
    "after",
];

describe("sameRow", () => {
    it("compares table rows by their cells, so a formatter's padding is not a difference", () => {
        assert.equal(sameRow(FORMATTED[2] ?? "", SCHEDULE_HEADER), true);
        assert.equal(sameRow(FORMATTED[3] ?? "", SCHEDULE_DIVIDER), true);
        assert.equal(sameRow("| 1 | `a` | b | open |", RENDERED[2] ?? ""), false);
        assert.equal(sameRow("| 1 | `a` | b |", RENDERED[2] ?? ""), false);
    });
});

describe("scheduleBounds and healSchedule", () => {
    it("finds a formatted table and leaves it alone when its cells already hold the rendering", () => {
        assert.deepEqual(scheduleBounds(FORMATTED), { from: 2, to: 4 });
        assert.equal(healSchedule(FORMATTED.join("\n"), RENDERED), null);
    });

    it("rewrites the table region when a cell disagrees with the rendering", () => {
        const drifted = FORMATTED.map((line, index) => (index === 4 ? "| 1 | `a` | b | open |" : line));
        const healed = healSchedule(drifted.join("\n"), RENDERED);
        assert.equal(healed, ["prose", "", ...RENDERED, "", "after"].join("\n"));
    });

    it("finds no table when the header is absent", () => {
        assert.equal(scheduleBounds(["| other | header |"]), null);
    });
});

describe("driftedRows", () => {
    it("lists the readings whose written row differs from the rendering, and none without a table", () => {
        const reading = {
            derived: true,
            evidence: "",
            plan: { establishes: "b", invariant: "a", ordinal: "1" },
            state: "planned" as const,
        };
        assert.deepEqual(driftedRows(FORMATTED, [reading]), []);
        const drifted = FORMATTED.map((line, index) => (index === 4 ? "| 1 | `a` | b | open |" : line));
        assert.deepEqual(driftedRows(drifted, [reading]), [reading]);
        assert.deepEqual(driftedRows(["no table"], [reading]), []);
    });
});
