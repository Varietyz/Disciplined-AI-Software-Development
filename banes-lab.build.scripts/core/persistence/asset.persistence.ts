import { join, resolve } from "node:path";
import { mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { unreferencedFiles } from "#core/analyzers/asset.analyzer";
import { writeVerbatim } from "@govlab/canonical-write";

export const replaceFolderFiles = function replaceFolderFiles(
    folder: string,
    files: ReadonlyMap<string, string>,
): void {
    mkdirSync(folder, { recursive: true });
    for (const name of readdirSync(folder)) {
        if (!files.has(name)) {
            rmSync(join(folder, name), { force: true, recursive: true });
        }
    }
    for (const [name, content] of files) {
        writeVerbatim(join(folder, name), content);
    }
};

export const pruneOutput = function pruneOutput(outDir: string): { count: number; bytes: number } {
    const unreferenced = unreferencedFiles(outDir);
    let bytes = 0;
    for (const file of unreferenced) {
        const target = resolve(outDir, file);
        bytes += statSync(target).size;
        rmSync(target, { force: true });
    }
    return { bytes, count: unreferenced.length };
};
