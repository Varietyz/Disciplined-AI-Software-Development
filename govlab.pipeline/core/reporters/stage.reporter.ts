import type { AbortInfo, HeaderInfo, ReportRow, Unit } from "#types/stage.types";
import {
    FAIL_MARK,
    PASS_MARK,
    REPORT_TABLE_DIVIDER,
    REPORT_TABLE_HEAD,
    allPassed,
    bypassNote,
    bypassedStage,
    commandLine,
    countNote,
    exitMark,
    exitNote,
    failedOutputDivider,
    failedTitle,
    headerLine,
    notRunLine,
    reportTitle,
    scopeNote,
    someFailed,
    stageHeading,
    tableRow,
    totalsLine,
} from "#configuration/strings/stage.strings";
import { C } from "#configuration/constants/shell.constants";
import { NUMBER_LOCALE } from "#configuration/constants/stage.constants";
import process from "node:process";
import { seconds } from "#core/formatters/stage.formatter";
import { tallyByStage } from "#core/converters/report.converter";

export const line = function line(text = ""): void {
    process.stdout.write(`${text}\n`);
};

export const printOutput = function printOutput(out: string): void {
    process.stdout.write(out.endsWith("\n") ? out : `${out}\n`);
};

export const printStageHeading = function printStageHeading(unit: Unit): void {
    if (unit.firstInStage) {
        line(`${C.bold}${C.cyan}${stageHeading(unit.stage.label, unit.stage.slug)}${C.reset}`);
    }
};

export const abort = function abort(info: AbortInfo): never {
    line(
        `\n${C.bold}${C.red}${FAIL_MARK} ${failedTitle(info.label)}${C.reset} ${info.tag} ${info.stepLabel} ${C.dim}${exitNote(info.elapsed, info.status)}${C.reset}`,
    );
    line(`${C.dim}${commandLine(info.command)}${C.reset}`);
    line(`${C.dim}${notRunLine(info.notRun)}${C.reset}\n`);
    process.exit(info.status);
};

const scopeNoteOf = function scopeNoteOf(scope: readonly string[]): string {
    return scope.length > 0 ? `${C.yellow}${scopeNote(scope)}${C.reset}` : "";
};

export const printHeader = function printHeader(info: HeaderInfo): void {
    line(
        `${C.bold}${C.cyan}${headerLine(info.label, info.total, info.activeCount)}${C.reset}${bypassNote(info.bypassed.length)}${scopeNoteOf(info.scope)}\n`,
    );
    for (const stage of info.bypassed) {
        line(`${C.dim}${bypassedStage(stage.label, stage.slug)}${C.reset}`);
    }
    if (info.bypassed.length > 0) {
        line();
    }
};

const countTag = function countTag(row: ReportRow): string {
    return row.count === null ? "" : ` ${C.dim}${countNote(row.count)}${C.reset}`;
};

export const reportLine = function reportLine(prefix: string, row: ReportRow): void {
    const mark = row.code === 0 ? `${C.green}${PASS_MARK}${C.reset}` : `${C.red}${exitMark(row.code)}${C.reset}`;
    line(`${prefix}${mark} ${row.label}${countTag(row)}`);
};

export const printReportSummary = function printReportSummary(
    rows: readonly ReportRow[],
    label: string,
    startedAll: number,
): void {
    line(`\n${C.bold}${C.cyan}${reportTitle(label)}${C.reset}\n`);
    line(REPORT_TABLE_HEAD);
    line(REPORT_TABLE_DIVIDER);
    for (const [stage, entry] of tallyByStage(rows)) {
        line(tableRow(stage, entry.passed, entry.failed, entry.violations.toLocaleString(NUMBER_LOCALE)));
    }
    const totalViolations = rows.reduce((sum, row) => sum + (row.count ?? 0), 0);
    const failed = rows.filter((row) => row.code !== 0);
    const verdict =
        failed.length === 0
            ? `${C.green}${allPassed(rows.length)}`
            : `${C.red}${someFailed(failed.length, rows.length)}`;
    line(
        `\n${C.bold}${verdict}${C.reset}: ${totalsLine(totalViolations.toLocaleString(NUMBER_LOCALE), seconds(startedAll))}`,
    );
    for (const row of failed) {
        line(`\n${C.dim}${failedOutputDivider(row.stage, row.label, row.code)}${C.reset}`);
        printOutput(row.out);
    }
};
