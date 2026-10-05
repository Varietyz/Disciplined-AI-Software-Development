import { afterAll, beforeAll, describe, it } from "vitest";
import {
    agendaRowAdded,
    planFileMissing,
    planTerminatorMissing,
} from "coordination-surface/tools/core/strings/agenda.strings.ts";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { readSchedule, runAgendaRow } from "coordination-surface/tools/core/runners/agenda.runner.ts";
import assert from "node:assert/strict";
import { join } from "node:path";
import { schedule } from "coordination-surface/config/agenda.config.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

let scratch = "";

let plans = 0;

const request = function request(plan: string): Parameters<typeof runAgendaRow>[0] {
    return { establishes: "probe", invariant: "a-probe-invariant", note: "", ordinal: "1", plan };
};

const planFile = function planFile(text: string): string {
    plans += 1;
    const plan = join(scratch, `agenda${String(plans)}.plan.txt`);
    writeVerbatim(plan, text);
    return plan;
};

describe("runAgendaRow", () => {
    beforeAll(() => {
        scratch = mkdtempSync(join(tmpdir(), "coordination-agenda-"));
    });

    afterAll(() => {
        rmSync(scratch, { force: true, recursive: true });
    });

    it("adds the first row to a schedule that opens and closes on one line", () => {
        const plan = planFile("export const schedule = defineSchedule([]);\n");
        const outcome = runAgendaRow(request(plan));
        assert.deepEqual(outcome, { code: 0, message: agendaRowAdded("a-probe-invariant", plan) });
        const lines = readFileSync(plan, "utf8").split("\n");
        assert.equal(lines[0], "export const schedule = defineSchedule([");
        assert.ok(lines.includes('        invariant: "a-probe-invariant",'));
        assert.equal(lines.at(-2), "]);");
    });

    it("adds a row before a closing line of its own", () => {
        const plan = planFile("export const schedule = defineSchedule([\n]);\n");
        assert.equal(runAgendaRow(request(plan)).code, 0);
        const lines = readFileSync(plan, "utf8").split("\n");
        assert.equal(lines[0], "export const schedule = defineSchedule([");
        assert.equal(lines[1], "    {");
        assert.equal(lines.at(-2), "]);");
    });

    it("refuses a plan with no closing line, and leaves it unchanged", () => {
        const plan = planFile("export const schedule = [];\n");
        assert.deepEqual(runAgendaRow(request(plan)), { code: 2, message: planTerminatorMissing(plan) });
        assert.equal(readFileSync(plan, "utf8"), "export const schedule = [];\n");
    });

    it("refuses a plan file that does not exist", () => {
        const missing = join(tmpdir(), "coordination-agenda-absent", "agenda.plan.txt");
        assert.deepEqual(runAgendaRow(request(missing)), { code: 2, message: planFileMissing(missing) });
    });
});

describe("readSchedule", () => {
    it("reads each scheduled row with no venue on disk as planned, or as its declared state", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-schedule-"));
        try {
            const readings = readSchedule(root);
            assert.equal(readings.length, schedule.length);
            for (const reading of readings) {
                assert.equal(reading.state, reading.plan.declaredState ?? "planned");
            }
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
