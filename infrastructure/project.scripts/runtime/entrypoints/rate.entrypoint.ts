import { DATE_LENGTH, PEER_GROUPS, RATE_SOURCE } from "#configuration/constants/rate.constants";
import { NO_READABLE_RECORDS, countMismatch, reportWritten, sourceAnswered } from "#configuration/strings/rate.strings";
import { recordsIn, statedCount, statedUpdate } from "#core/selectors/rate.selector";
import { summarize, withinMonths } from "#core/analyzers/rate.analyzer";
import { RATES_ARGV } from "#configuration/configs/rate.config";
import { dirname } from "node:path";
import { formatReport } from "#core/formatters/rate.formatter";
import { mkdirSync } from "node:fs";
import process from "node:process";
import { readRateOptions } from "#core/converters/rate.converter";
import { resolveArgv } from "@govlab/argv";
import { writeGeneratedMarkdown } from "@govlab/canonical-write";

const options = readRateOptions(resolveArgv(RATES_ARGV));
const response = await fetch(RATE_SOURCE);
const html = response.ok ? await response.text() : "";
const records = recordsIn(html);
const stated = statedCount(html);

if (!response.ok) {
    process.stderr.write(sourceAnswered(response.status));
    process.exitCode = 1;
} else if (records.length === 0) {
    process.stderr.write(NO_READABLE_RECORDS);
    process.exitCode = 1;
} else if (stated !== null && stated !== records.length) {
    process.stderr.write(countMismatch(stated, records.length));
    process.exitCode = 1;
} else {
    const counted = withinMonths(records, options.months);
    const report = formatReport({
        counted,
        fetchedOn: new Date().toISOString().slice(0, DATE_LENGTH),
        groups: PEER_GROUPS.map((group) => summarize(counted, group, options.rate)),
        months: options.months,
        rate: options.rate,
        records,
        statedCount: stated,
        statedUpdate: statedUpdate(html),
    });
    mkdirSync(dirname(options.out), { recursive: true });
    await writeGeneratedMarkdown(options.out, report);
    process.stdout.write(reportWritten(options.out, counted.length, records.length));
}
