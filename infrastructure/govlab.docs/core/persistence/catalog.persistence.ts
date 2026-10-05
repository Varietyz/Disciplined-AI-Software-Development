import { BARREL_SUFFIX, CATALOG_FILE } from "#configuration/constants/document.constants";
import { ROOT, absolutePath } from "@ssot/paths";
import { mkdirSync, rmSync } from "node:fs";
import type { CatalogPayload } from "#types/index.types";
import { govlabPrettierConfig } from "@govlab/quality/config";
import { healFile } from "#core/persistence/document.persistence";
import { join } from "node:path";
import prettier from "prettier";
import { readDirSafe } from "#core/loaders/base.loader";

export const indexDirectory = function indexDirectory(): string {
    const dir = absolutePath("docArch.index");
    mkdirSync(dir, { recursive: true });
    return dir;
};

export const writeCatalogJson = async function writeCatalogJson(
    indexDir: string,
    payload: CatalogPayload,
): Promise<boolean> {
    const target = join(indexDir, CATALOG_FILE);
    const base = await govlabPrettierConfig(ROOT);
    const formatted = await prettier.format(JSON.stringify(payload), { ...base, filepath: target });
    return healFile(target, formatted);
};

export const barrelPath = function barrelPath(indexDir: string, concern: string): string {
    return join(indexDir, `${concern}${BARREL_SUFFIX}`);
};

export const pruneStaleBarrels = function pruneStaleBarrels(indexDir: string, live: ReadonlySet<string>): number {
    const stale = readDirSafe(indexDir).filter(
        (entry) =>
            entry.isFile() &&
            entry.name.endsWith(BARREL_SUFFIX) &&
            !live.has(entry.name.slice(0, -BARREL_SUFFIX.length)),
    );
    for (const entry of stale) {
        rmSync(join(indexDir, entry.name));
    }
    return stale.length;
};
