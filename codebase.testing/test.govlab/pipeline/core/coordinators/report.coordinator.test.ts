import type { ActiveRun, RunOptions, Unit } from "@govlab/pipeline/types/stage.types.ts";
import { describe, expect, it, vi } from "vitest";
import {
    flushReports,
    flushViolations,
    recordRow,
    runReport,
} from "@govlab/pipeline/core/coordinators/report.coordinator.ts";
import { GATE_ARGV } from "@govlab/pipeline/configuration/configs/invocation.config.ts";
import { argvOf } from "@govlab/argv";
import { createStepStore } from "@govlab/pipeline/core/stores/step.store.ts";
import process from "node:process";
import { shellFor } from "@govlab/pipeline/core/resolvers/shell.resolver.ts";
import { stageArgsOf } from "@govlab/pipeline/core/converters/invocation.converter.ts";

const REPORT = "report.json";
const VIOLATIONS = "violations.json";
const PASSING = 'node -e "process.exit(0)"';

const runFor = function runFor(reports: Map<string, unknown>): ActiveRun {
    const options: RunOptions = {
        reportPath: REPORT,
        violationsPath: VIOLATIONS,
        writeReport: async (target, data) => {
            reports.set(target, data);
            await Promise.resolve();
        },
    };
    return {
        context: { args: stageArgsOf(argvOf(GATE_ARGV, ["--report"])), options, shell: shellFor(process.platform) },
        label: "probe",
        store: createStepStore(),
        total: 1,
    };
};

const silenced = async function silenced(run: () => Promise<void>): Promise<void> {
    const spy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
        await run();
    } finally {
        spy.mockRestore();
    }
};

describe("recordRow", () => {
    it("stores a row as a step output", () => {
        const run = runFor(new Map());
        recordRow(run, { code: 1, count: null, label: "Lint", out: "trace", stage: "linting" });
        expect(run.store.outputs()).toStrictEqual([{ label: "Lint", ok: false, out: "trace", stage: "linting" }]);
    });
});

describe("flushReports", () => {
    it("writes the report and the violations artifact", async () => {
        const reports = new Map<string, unknown>();
        await silenced(async () => {
            await flushReports(runFor(reports), null);
        });
        expect([...reports.keys()].toSorted((a, b) => a.localeCompare(b))).toStrictEqual([REPORT, VIOLATIONS]);
    });
});

describe("flushViolations", () => {
    it("writes only the violations artifact", async () => {
        const reports = new Map<string, unknown>();
        await silenced(async () => {
            await flushViolations(runFor(reports), "linting");
        });
        expect([...reports.keys()]).toStrictEqual([VIOLATIONS]);
    });
});

describe("runReport", () => {
    it("runs every unit captured and writes both artifacts", async () => {
        const reports = new Map<string, unknown>();
        const unit: Unit = {
            firstInStage: true,
            from: 1,
            stage: { label: "Prepare", slug: "prepare", steps: [] },
            step: { label: "probe", run: PASSING },
            to: 1,
        };
        await silenced(async () => {
            await runReport(runFor(reports), [unit], Date.now());
        });
        expect(reports.has(REPORT)).toBe(true);
        expect(reports.has(VIOLATIONS)).toBe(true);
    });
});
