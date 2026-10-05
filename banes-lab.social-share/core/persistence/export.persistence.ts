import { EXPORT_RUNNING, SUBJECT_SEPARATOR } from "#configuration/strings/card.strings";
import { dirname, join } from "node:path";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import type { Disposer } from "@banes-lab/web/types/base.types.ts";
import { LOCK_FILE } from "#configuration/constants/card.constants";
import type { ShareEntry } from "#types/image.types";
import { absolutePath } from "@ssot/paths";
import { writeVerbatim } from "@govlab/canonical-write";

const TEXT = "utf8";
const MISSING_PROCESS = "ESRCH";
const SLASH = "/";

const isAlive = function isAlive(pid: number): boolean {
    try {
        process.kill(pid, 0);
        return true;
    } catch (error) {
        if (error instanceof Error && Reflect.get(error, "code") === MISSING_PROCESS) {
            return false;
        }
        throw error;
    }
};

const holderOf = function holderOf(location: string): number | null {
    if (!existsSync(location)) {
        return null;
    }
    const pid = Number(readFileSync(location, TEXT).trim());
    return Number.isInteger(pid) && isAlive(pid) ? pid : null;
};

export const holdCaptureLock = function holdCaptureLock(location = absolutePath("builds.root", LOCK_FILE)): Disposer {
    const holder = holderOf(location);
    if (holder === process.pid) {
        return () => {};
    }
    if (holder !== null) {
        throw new Error(EXPORT_RUNNING + SUBJECT_SEPARATOR + String(holder));
    }
    mkdirSync(dirname(location), { recursive: true });
    writeVerbatim(location, String(process.pid));
    return () => {
        rmSync(location, { force: true });
    };
};

const servedName = function servedName(entry: ShareEntry): string {
    return entry.source.slice(entry.source.lastIndexOf(SLASH) + 1);
};

export const unpublishedShares = function unpublishedShares(
    entries: readonly ShareEntry[],
    served: string,
): readonly string[] {
    return entries.map(servedName).filter((file) => !existsSync(join(served, file)));
};

export const strayShares = function strayShares(entries: readonly ShareEntry[], served: string): readonly string[] {
    if (!existsSync(served)) {
        return [];
    }
    const named = new Set(entries.map(servedName));
    return readdirSync(served).filter((file) => !named.has(file));
};

export const publishShares = function publishShares(
    entries: readonly ShareEntry[],
    renders: string,
    served: string,
): readonly string[] {
    mkdirSync(served, { recursive: true });
    for (const file of strayShares(entries, served)) {
        rmSync(join(served, file));
    }
    const published = entries.map(servedName).filter((file) => {
        const target = join(served, file);
        const source = join(renders, file);
        return !existsSync(target) || !readFileSync(target).equals(readFileSync(source));
    });
    for (const file of published) {
        writeVerbatim(join(served, file), readFileSync(join(renders, file)));
    }
    return published;
};
