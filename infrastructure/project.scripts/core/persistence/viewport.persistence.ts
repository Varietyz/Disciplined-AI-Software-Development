import { REPORT_FILE } from "#configuration/constants/viewport.constants";
import type { ViewportResult } from "#types/viewport.types";
import { join } from "node:path";
import process from "node:process";
import { reportJson } from "#core/formatters/viewport.formatter";
import { reportWritten } from "#configuration/strings/viewport.strings";
import { writeVerbatim } from "@govlab/canonical-write";

const PNG_BASE64 = "base64";

export const writeShot = function writeShot(outDir: string, name: string, data: string): void {
    writeVerbatim(join(outDir, name), Buffer.from(data, PNG_BASE64));
};

export const writeReport = function writeReport(outDir: string, results: readonly ViewportResult[]): void {
    const path = join(outDir, REPORT_FILE);
    writeVerbatim(path, reportJson(results));
    process.stdout.write(reportWritten(path, results.length));
};
