import type { ReportArtifact, RunContext, Stage } from "@govlab/pipeline/types/stage.types.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GATE_ARGV } from "@govlab/pipeline/configuration/configs/invocation.config.ts";
import { argvOf } from "@govlab/argv";
import process from "node:process";
import { runStages } from "@govlab/pipeline/core/coordinators/stage.coordinator.ts";
import { shellFor } from "@govlab/pipeline/core/resolvers/shell.resolver.ts";
import { stageArgsOf } from "@govlab/pipeline/core/converters/invocation.converter.ts";

const LABEL = "probe-run";
const REPORT_PATH = "verify.report.generated.json";
const VIOLATIONS_PATH = "violations.report.generated.json";
const PASSING = 'node -e "process.exit(0)"';
const FAILING = 'node -e "process.exit(1)"';
const SHELL = shellFor(process.platform);

afterEach(() => {
    process.exitCode = 0;
});

const stage = function stage(slug: string, run: string): Stage {
    return { label: slug, slug, steps: [{ label: slug, run }] };
};

const isReportArtifact = function isReportArtifact(value: unknown): value is ReportArtifact {
    return typeof value === "object" && value !== null && "totals" in value;
};

interface RunOutcome {
    reports: Map<string, unknown>;
    stdout: string;
}

const runWith = async function runWith(words: readonly string[], stages: readonly Stage[]): Promise<RunOutcome> {
    const reports = new Map<string, unknown>();
    const written: string[] = [];
    const context: RunContext = {
        args: stageArgsOf(argvOf(GATE_ARGV, words)),
        options: {
            reportPath: REPORT_PATH,
            violationsPath: VIOLATIONS_PATH,
            writeReport: async (target, data) => {
                reports.set(target, data);
                await Promise.resolve();
            },
        },
        shell: SHELL,
    };
    const out = vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
        written.push(String(chunk));
        return true;
    });
    try {
        await runStages(LABEL, stages, context);
    } finally {
        out.mockRestore();
    }
    return { reports, stdout: written.join("") };
};

describe("runStages", () => {
    it("runs every step and reports the run as passed", async () => {
        const outcome = await runWith(["--report"], [stage("prepare", PASSING)]);
        expect(outcome.stdout).toContain(LABEL);
        expect(outcome.stdout).toContain("all 1 steps passed");
    });

    it("writes both artifacts on every exit path, so a present artifact does not mean a passing run", async () => {
        const outcome = await runWith(["--report"], [stage("prepare", PASSING)]);
        expect([...outcome.reports.keys()].toSorted((a, b) => a.localeCompare(b))).toStrictEqual([
            REPORT_PATH,
            VIOLATIONS_PATH,
        ]);
    });

    it("totals the steps it ran into the report artifact", async () => {
        const outcome = await runWith(["--report"], [stage("prepare", PASSING), stage("linting", PASSING)]);
        const artifact = outcome.reports.get(REPORT_PATH);
        expect(isReportArtifact(artifact) ? artifact.totals.steps : null).toBe(2);
    });

    it("drops a bypassed stage from the run and names it in the header", async () => {
        const outcome = await runWith(
            ["--report", "--bypass", "linting"],
            [stage("prepare", PASSING), stage("linting", FAILING)],
        );
        const artifact = outcome.reports.get(REPORT_PATH);
        expect(isReportArtifact(artifact) ? artifact.totals.steps : null).toBe(1);
        expect(outcome.stdout).toContain("bypassed");
    });

    it("fails before any step runs when a stage slug is unknown, naming the known slugs", async () => {
        await expect(runWith(["--bypass", "lintnig"], [stage("prepare", PASSING)])).rejects.toThrow(
            "unknown stage slug lintnig. Known slugs: prepare.",
        );
    });

    it("records a failing step and keeps running under report mode", async () => {
        const outcome = await runWith(["--report"], [stage("prepare", PASSING), stage("linting", FAILING)]);
        const artifact = outcome.reports.get(REPORT_PATH);
        expect(isReportArtifact(artifact) ? artifact.ok : null).toBe(false);
        expect(outcome.stdout).toContain("1/2 steps failed");
    });

    it("runs a passing plan to its passed line outside report mode", async () => {
        const outcome = await runWith([], [stage("prepare", PASSING)]);
        expect(outcome.stdout).toContain(`${LABEL} passed: 1 steps`);
        expect(outcome.reports.has(REPORT_PATH)).toBe(true);
    });
});
