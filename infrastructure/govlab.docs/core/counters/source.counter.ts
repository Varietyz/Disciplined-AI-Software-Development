import { type PathExclusion, excludeMatcher } from "@govlab/quality/config";
import { ROOT } from "@ssot/paths";
import type { SourceStats } from "#types/index.types";
import path from "node:path";
import { readFileSync } from "node:fs";
import { walkFiles } from "#core/loaders/base.loader";

const SOURCE_SUFFIXES: readonly string[] = [".ts", ".mts", ".cts", ".css", ".html", ".json"];
const COUNTABLE_SUFFIXES: readonly string[] = [".ts", ".js"];
const CONFIG_SUFFIXES: readonly string[] = [".config.js", ".config.ts"];
const BARREL_FILE = "index.ts";
const GENERATED_MARK = ".generated.";
const LINE_COMMENT = "//";
const isExcluded = await excludeMatcher(ROOT);

const isSourceFile = function isSourceFile(file: string): boolean {
    return !file.includes(GENERATED_MARK) && SOURCE_SUFFIXES.some((suffix) => file.endsWith(suffix));
};

export const countSourceFiles = function countSourceFiles(dir: string): number {
    return walkFiles(dir, isExcluded).filter((file) => isSourceFile(path.basename(file))).length;
};

const isCountableSource = function isCountableSource(file: string): boolean {
    const base = path.basename(file);
    if (!COUNTABLE_SUFFIXES.some((suffix) => file.endsWith(suffix)) || base === BARREL_FILE) {
        return false;
    }
    return !CONFIG_SUFFIXES.some((suffix) => base.endsWith(suffix));
};

const countLoc = function countLoc(raw: string): number {
    return raw.split("\n").filter((line) => {
        const trimmed = line.trim();
        return trimmed.length > 0 && !trimmed.startsWith(LINE_COMMENT);
    }).length;
};

export const collectSourceStats = function collectSourceStats(
    packageDir: string,
    excluded: PathExclusion,
): SourceStats {
    const files = walkFiles(packageDir, excluded).filter(isCountableSource);
    const loc = files.reduce((total, file) => total + countLoc(readFileSync(file, "utf8")), 0);
    return { fileCount: files.length, loc };
};
