import type { ActiveRun, ParallelStep, ReportRow, Unit } from "#types/stage.types";
import { C, FALLBACK_EXIT } from "#configuration/constants/shell.constants";
import { buildArtifact, outputOf, rowOf, rowsOf } from "#core/converters/report.converter";
import { line, printReportSummary, printStageHeading, reportLine } from "#core/reporters/stage.reporter";
import { reportWritten, violationsWritten } from "#configuration/strings/stage.strings";
import { buildViolations } from "#core/converters/violation.converter";
import process from "node:process";
import { runCaptured } from "#core/adapters/shell.adapter";

export const recordRow = function recordRow(run: ActiveRun, row: ReportRow): void {
    run.store.collect(outputOf(row));
};

export const flushViolations = async function flushViolations(run: ActiveRun, stoppedAt: string | null): Promise<void> {
    const { violationsPath, writeReport } = run.context.options;
    if (writeReport === undefined || typeof violationsPath !== "string") {
        return;
    }
    const artifact = buildViolations(run.store.outputs(), run.label, stoppedAt, new Date().toISOString());
    await writeReport(violationsPath, artifact);
    line(`${C.dim}${violationsWritten(artifact.totals.violations, artifact.totals.files, violationsPath)}${C.reset}`);
};

export const flushReports = async function flushReports(run: ActiveRun, stoppedAt: string | null): Promise<void> {
    const { reportPath, writeReport } = run.context.options;
    if (writeReport !== undefined && typeof reportPath === "string") {
        const rows = rowsOf(run.store.outputs());
        await writeReport(reportPath, buildArtifact(rows, run.label));
    }
    await flushViolations(run, stoppedAt);
};

const reportSub = async function reportSub(run: ActiveRun, stage: string, sub: ParallelStep): Promise<ReportRow> {
    const row = rowOf(stage, sub.label, await runCaptured(run.context.shell, sub.run, sub.cwd));
    recordRow(run, row);
    reportLine("  ", row);
    return row;
};

const reportUnit = async function reportUnit(run: ActiveRun, unit: Unit): Promise<ReportRow[]> {
    printStageHeading(unit);
    if (unit.step.parallel) {
        return Promise.all(unit.step.parallel.map(async (sub) => reportSub(run, unit.stage.label, sub)));
    }
    const outcome = await runCaptured(run.context.shell, unit.step.run ?? "", unit.step.cwd);
    const row = rowOf(unit.stage.label, unit.step.label ?? "", outcome);
    recordRow(run, row);
    reportLine("", row);
    return [row];
};

export const runReport = async function runReport(
    run: ActiveRun,
    units: readonly Unit[],
    startedAll: number,
): Promise<void> {
    const rows = await units.reduce<Promise<ReportRow[]>>(async (prev, unit) => {
        const acc = await prev;
        return [...acc, ...(await reportUnit(run, unit))];
    }, Promise.resolve([]));
    printReportSummary(rows, run.label, startedAll);
    const { reportPath, writeReport } = run.context.options;
    if (typeof reportPath === "string" && writeReport !== undefined) {
        await writeReport(reportPath, buildArtifact(rows, run.label));
        line(`${C.dim}${reportWritten(reportPath)}${C.reset}`);
    }
    await flushViolations(run, null);
    if (rows.some((row) => row.code !== 0)) {
        process.exitCode = FALLBACK_EXIT;
    }
};
