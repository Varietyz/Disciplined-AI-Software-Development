export const ARCHITECTS_GROUP = "Senior and lead architects";

export const TECH_LEADS_GROUP = "Senior and lead tech leads";

export const CONSULTANTS_GROUP = "Senior and lead IT consultants";

export const ENGINEERS_GROUP = "Senior and lead software engineers";

export const EVERY_RECORD_GROUP = "Every record";

export const REPORT_TITLE = "# Day rates";

export const NO_RECORDS_CELLS = "no records | | | | ";

export const SELF_REPORTED_NOTE =
    "- The records are self-reported rates, so a group with few records moves a long way on one entry.";

export const TABLE_HEADER =
    "| Group | Records | Median | 25th percentile | 75th percentile | 90th percentile | Highest";

export const RATE_COLUMN = " | Below your rate";

export const UNKNOWN_UPDATE = "unknown";

export const NO_READABLE_RECORDS =
    "rates: the source page carries no rate records it can read; its layout may have changed\n";

export const unreadableRecord = function unreadableRecord(offset: number): string {
    return `rates: the record at offset ${String(offset)} of the source page is not valid JSON; its layout may have changed`;
};

export const sourceLine = function sourceLine(source: string, fetchedOn: string): string {
    return `- Source: ${source}, fetched on ${fetchedOn}.`;
};

export const holdingLine = function holdingLine(update: string, count: number, first: string, last: string): string {
    return `- The source states its last update as ${update} and holds ${String(count)} records, dated from ${first} to ${last}.`;
};

export const countedLine = function countedLine(counted: number, months: number): string {
    return `- This report counts the ${String(counted)} records from the last ${String(months)} months before the newest one.`;
};

export const rateColumnNote = function rateColumnNote(rate: string): string {
    return `The last column is the share of each group's records below ${rate} a day.`;
};

export const sourceAnswered = function sourceAnswered(status: number): string {
    return `rates: the source answered ${String(status)}; nothing was written\n`;
};

export const countMismatch = function countMismatch(stated: number, read: number): string {
    return `rates: the source states ${String(stated)} records and ${String(read)} were read; its layout may have changed\n`;
};

export const reportWritten = function reportWritten(path: string, counted: number, total: number): string {
    return `rates: wrote ${path} from ${String(counted)} of ${String(total)} records\n`;
};
