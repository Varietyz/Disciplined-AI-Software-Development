import { DATE_LENGTH, MS_PER_SECOND, RATE_SOURCE } from "#configuration/constants/rate.constants";
import type { GroupSummary, RateReport } from "#types/rate.types";
import {
    NO_RECORDS_CELLS,
    RATE_COLUMN,
    REPORT_TITLE,
    SELF_REPORTED_NOTE,
    TABLE_HEADER,
    UNKNOWN_UPDATE,
    countedLine,
    holdingLine,
    rateColumnNote,
    sourceLine,
} from "#configuration/strings/rate.strings";

const RATE_DIVIDER = " | ---:";
const TABLE_DIVIDER = "| --- | ---: | ---: | ---: | ---: | ---: | ---:";
const CELL = " | ";

export const dayOf = function dayOf(seconds: number): string {
    return new Date(seconds * MS_PER_SECOND).toISOString().slice(0, DATE_LENGTH);
};

const euro = function euro(value: number): string {
    return `€${Math.round(value).toLocaleString("en-US")}`;
};

const groupRow = function groupRow(summary: GroupSummary): string {
    const cells =
        summary.count === 0
            ? NO_RECORDS_CELLS
            : [summary.median, summary.p25, summary.p75, summary.p90, summary.highest].map(euro).join(CELL);
    const position = summary.below === null ? "" : `${CELL}${String(summary.below)}%`;
    return `| ${summary.label}${CELL}${String(summary.count)}${CELL}${cells}${position} |`;
};

const sourceLines = function sourceLines(report: RateReport): string[] {
    const dates = report.records.map((record) => record.createdAt).toSorted((left, right) => left - right);
    const first = dayOf(dates[0] ?? 0);
    const last = dayOf(dates.at(-1) ?? 0);
    return [
        sourceLine(RATE_SOURCE, report.fetchedOn),
        holdingLine(report.statedUpdate || UNKNOWN_UPDATE, report.records.length, first, last),
        countedLine(report.counted.length, report.months),
        SELF_REPORTED_NOTE,
    ];
};

export const formatReport = function formatReport(report: RateReport): string {
    const rated = report.rate !== null;
    return [
        REPORT_TITLE,
        "",
        ...sourceLines(report),
        ...(report.rate === null ? [] : ["", rateColumnNote(euro(report.rate))]),
        "",
        `${TABLE_HEADER}${rated ? RATE_COLUMN : ""} |`,
        `${TABLE_DIVIDER}${rated ? RATE_DIVIDER : ""} |`,
        ...report.groups.map(groupRow),
        "",
    ].join("\n");
};
