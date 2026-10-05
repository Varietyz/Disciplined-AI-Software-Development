import { existsSync, readFileSync } from "node:fs";
import type { ModuleFindings } from "#types/report.types";
import { buildMasterFindings } from "#core/formatters/report.formatter";
import { join } from "node:path";

const currentText = function currentText(path: string): string {
    return existsSync(path) ? readFileSync(path, "utf8").trimEnd() : "";
};

export const artifactDrift = function artifactDrift(hexDir: string, artifacts: ReadonlyMap<string, string>): boolean {
    return [...artifacts].some(([name, content]) => currentText(join(hexDir, name)) !== content.trimEnd());
};

export const artifactsEqual = function artifactsEqual(
    a: ReadonlyMap<string, string>,
    b: ReadonlyMap<string, string>,
): boolean {
    return a.size === b.size && [...a].every(([name, content]) => b.get(name)?.trimEnd() === content.trimEnd());
};

export const checkHexMaster = function checkHexMaster(
    masterPath: string,
    collected: readonly ModuleFindings[],
): boolean {
    return currentText(masterPath) === buildMasterFindings(collected).trimEnd();
};
