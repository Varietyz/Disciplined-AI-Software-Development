import type { ActiveRun, ParallelStep, RunContext, Stage, SubResult, Unit } from "#types/stage.types";
import { C, FALLBACK_EXIT } from "#configuration/constants/shell.constants";
import { COMMAND_JOIN, MESSAGE_SEPARATOR } from "#configuration/constants/stage.constants";
import {
    FAIL_MARK,
    PARALLEL_GROUP,
    PASS_MARK,
    bypassNote,
    concurrentGroup,
    elapsedNote,
    exitNote,
    failedInGroup,
    outputDivider,
    passedLine,
    stepLine,
} from "#configuration/strings/stage.strings";
import { abort, line, printHeader, printOutput, printStageHeading } from "#core/reporters/stage.reporter";
import { argErrorsOf, isActive, selectSteps } from "#core/selectors/stage.selector";
import { flushReports, recordRow, runReport } from "#core/coordinators/report.coordinator";
import { planUnits, stepCount } from "#core/converters/stage.converter";
import { runCaptured, runTee } from "#core/adapters/shell.adapter";
import { createStepStore } from "#core/stores/step.store";
import { rowOf } from "#core/converters/report.converter";
import { seconds } from "#core/formatters/stage.formatter";

const runSub = async function runSub(run: ActiveRun, stage: string, sub: ParallelStep): Promise<SubResult> {
    const startedSub = Date.now();
    const outcome = await runCaptured(run.context.shell, sub.run, sub.cwd);
    recordRow(run, rowOf(stage, sub.label, outcome));
    const elapsed = seconds(startedSub);
    line(
        outcome.code === 0
            ? `  ${C.green}${PASS_MARK}${C.reset} ${sub.label} ${C.dim}${elapsedNote(elapsed)}${C.reset}`
            : `  ${C.red}${FAIL_MARK}${C.reset} ${sub.label} ${C.dim}${exitNote(elapsed, outcome.code)}${C.reset}`,
    );
    return { ...outcome, sub };
};

const printFailures = function printFailures(failed: readonly SubResult[]): void {
    for (const result of failed) {
        line(`${C.dim}${outputDivider(result.sub.label)}${C.reset}`);
        printOutput(result.out);
    }
    line();
};

const runParallelUnit = async function runParallelUnit(run: ActiveRun, unit: Unit): Promise<void> {
    const parallel = unit.step.parallel ?? [];
    const groupStart = Date.now();
    const groupLabel = unit.step.label ?? PARALLEL_GROUP;
    const range = `[${String(unit.from)}-${String(unit.to)}/${String(run.total)}]`;
    line(`${C.dim}${concurrentGroup(range, groupLabel, parallel.length)}${C.reset}`);
    const results = await Promise.all(parallel.map(async (sub) => runSub(run, unit.stage.label, sub)));
    const failed = results.filter((result) => result.code !== 0);
    printFailures(failed);
    if (failed.length === 0) {
        return;
    }
    await flushReports(run, groupLabel);
    abort({
        command: failed.map((result) => result.sub.run).join(COMMAND_JOIN),
        elapsed: seconds(groupStart),
        label: run.label,
        notRun: run.total - unit.to,
        status: failed[0]?.code ?? FALLBACK_EXIT,
        stepLabel: failedInGroup(failed.length, results.length, groupLabel),
        tag: range,
    });
};

const runSingleUnit = async function runSingleUnit(run: ActiveRun, unit: Unit): Promise<void> {
    const tag = `[${String(unit.to)}/${String(run.total)}]`;
    const stepLabel = unit.step.label ?? "";
    const command = unit.step.run ?? "";
    line(`${C.dim}${stepLine(tag, stepLabel, command)}${C.reset}`);
    const startedStep = Date.now();
    const outcome = await runTee(run.context.shell, command, unit.step.cwd);
    recordRow(run, rowOf(unit.stage.label, stepLabel, outcome));
    const elapsed = seconds(startedStep);
    if (outcome.code !== 0) {
        await flushReports(run, stepLabel);
        abort({
            command,
            elapsed,
            label: run.label,
            notRun: run.total - unit.to,
            status: outcome.code,
            stepLabel,
            tag,
        });
    }
    line(`${C.green}${PASS_MARK}${C.reset} ${stepLabel} ${C.dim}${elapsedNote(elapsed)}${C.reset}\n`);
};

const runUnit = async function runUnit(run: ActiveRun, unit: Unit): Promise<void> {
    printStageHeading(unit);
    await (unit.step.parallel ? runParallelUnit(run, unit) : runSingleUnit(run, unit));
};

const runPlan = async function runPlan(run: ActiveRun, units: readonly Unit[]): Promise<void> {
    await units.reduce(async (prev, unit) => {
        await prev;
        await runUnit(run, unit);
    }, Promise.resolve());
};

export const runStages = async function runStages(
    label: string,
    stages: readonly Stage[],
    context: RunContext,
): Promise<void> {
    const errors = argErrorsOf(label, stages, context.args);
    if (errors.length > 0) {
        throw new Error(errors.join(MESSAGE_SEPARATOR));
    }
    const active = stages
        .filter((stage) => isActive(stage, context.args))
        .map((stage) => selectSteps(stage, context.args))
        .filter((stage) => stage.steps.length > 0);
    const bypassed = stages.filter((stage) => !isActive(stage, context.args));
    const units = planUnits(active);
    const total = units.reduce((sum, unit) => sum + stepCount(unit.step), 0);
    const run: ActiveRun = { context, label, store: createStepStore(), total };
    const startedAll = Date.now();
    printHeader({ activeCount: active.length, bypassed, label, scope: [...context.args.members], total });
    if (context.args.report) {
        await runReport(run, units, startedAll);
        return;
    }
    await runPlan(run, units);
    await flushReports(run, null);
    line(`${C.bold}${C.green}${passedLine(label, total, seconds(startedAll))}${C.reset}${bypassNote(bypassed.length)}`);
};
