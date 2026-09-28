import { existsSync, readFileSync, readdirSync } from "node:fs";
import { GENERATED_DIR } from "../constants/path.constants.ts";
import type { ParsedReport } from "../types/report.types.ts";
import { REPORT_SUFFIX } from "../constants/report.constants.ts";
import { resolve } from "node:path";
import { tryParse } from "./json.reader.ts";

export const reportIdOf = function reportIdOf(entry: string): string {
    return entry.slice(0, entry.length - REPORT_SUFFIX.length);
};

export const reportEntries = function reportEntries(repoRoot: string): string[] {
    const dir = resolve(repoRoot, GENERATED_DIR);
    return existsSync(dir) ? readdirSync(dir).filter((entry) => entry.endsWith(REPORT_SUFFIX)) : [];
};

export const reportsIn = function reportsIn(repoRoot: string): ParsedReport[] {
    const dir = resolve(repoRoot, GENERATED_DIR);
    return reportEntries(repoRoot).flatMap((entry) => {
        const path = resolve(dir, entry);
        const value = tryParse(readFileSync(path, "utf8"))?.value;
        return typeof value === "object" && value !== null ? [{ entry, path, value }] : [];
    });
};
