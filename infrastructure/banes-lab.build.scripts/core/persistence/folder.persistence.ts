import { copyFile, mkdir, readFile, readdir, rm, rmdir, stat } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import type { FolderSync } from "#types/folder.types";
import { existsSync } from "node:fs";
import { toPosix } from "#core/resolvers/asset.resolver";

const BATCH = 64;

const admitAll = function admitAll(): boolean {
    return true;
};

const filesUnder = async function filesUnder(
    root: string,
    dir: string,
    admit: (path: string) => boolean,
): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const nested = await Promise.all(
        entries
            .map((entry) => ({ entry, path: join(dir, entry.name) }))
            .filter(({ path }) => admit(path))
            .map(async ({ entry, path }) =>
                entry.isDirectory() ? filesUnder(root, path, admit) : [toPosix(relative(root, path))],
            ),
    );
    return nested.flat();
};

const differs = async function differs(source: string, target: string): Promise<boolean> {
    if (!existsSync(target)) {
        return true;
    }
    const [from, to] = await Promise.all([stat(source), stat(target)]);
    if (from.size !== to.size) {
        return true;
    }
    const [left, right] = await Promise.all([readFile(source), readFile(target)]);
    return !left.equals(right);
};

const inBatches = async function inBatches<T>(
    items: readonly T[],
    each: (item: T) => Promise<boolean>,
): Promise<number> {
    const batches = Array.from({ length: Math.ceil(items.length / BATCH) }, (_, index) =>
        items.slice(index * BATCH, (index + 1) * BATCH),
    );
    return batches.reduce(async (previous, batch) => {
        const done = await previous;
        const results = await Promise.all(batch.map(each));
        return done + results.filter(Boolean).length;
    }, Promise.resolve(0));
};

const pruneEmptyFolders = async function pruneEmptyFolders(dir: string): Promise<boolean> {
    const entries = await readdir(dir, { withFileTypes: true });
    const emptied = await Promise.all(
        entries.filter((entry) => entry.isDirectory()).map(async (entry) => pruneEmptyFolders(join(dir, entry.name))),
    );
    const left = entries.length - emptied.filter(Boolean).length;
    if (left === 0) {
        await rmdir(dir);
        return true;
    }
    return false;
};

export const syncFolder = async function syncFolder(
    from: string,
    to: string,
    admit: (path: string) => boolean = admitAll,
): Promise<FolderSync> {
    const wanted = await filesUnder(from, from, admit);
    const kept = new Set(wanted);
    const present = existsSync(to) ? await filesUnder(to, to, admitAll) : [];
    const copied = await inBatches(wanted, async (file) => {
        const source = join(from, file);
        const target = join(to, file);
        if (!(await differs(source, target))) {
            return false;
        }
        await mkdir(dirname(target), { recursive: true });
        await copyFile(source, target);
        return true;
    });
    const stale = present.filter((file) => !kept.has(file));
    await inBatches(stale, async (file) => {
        await rm(join(to, file), { force: true });
        return true;
    });
    if (existsSync(to)) {
        await pruneEmptyFolders(to);
    }
    return { copied, removed: stale.length };
};
