import type {
    CommitContext,
    FixAction,
    FixableResult,
    SafeFixFs,
    SafeFixOptions,
    SafeFixOutcome,
} from "#types/edit.types";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync } from "node:fs";
import { isInsideRoot } from "#core/predicates/location.predicate";
import { outsideWorkspace } from "#configuration/strings/tool.strings";
import path from "node:path";
import { relativePath } from "@ssot/paths";
import { writeVerbatim } from "@govlab/canonical-write";

const TEMP_SUFFIX = ".govlab-fix-tmp";
const BACKUP_FOLDER = "fix-backup";
const TEMP_FOLDER = "fix-tmp";
const RETRY_1_MS = 40;
const RETRY_2_MS = 120;
const RETRY_3_MS = 360;
const NO_DELAY = 0;
const RETRY_DELAYS_MS = [NO_DELAY, RETRY_1_MS, RETRY_2_MS, RETRY_3_MS];
const INT32_BYTES = 4;
const TRANSIENT_CODES = new Set(["EPERM", "EBUSY", "EACCES", "ENOTEMPTY"]);

const NODE_FS: SafeFixFs = {
    ensureDir: (dir) => {
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }
    },
    read: (file) => readFileSync(file, "utf8"),
    remove: (file) => {
        if (existsSync(file)) {
            rmSync(file, { force: true });
        }
    },
    rename: (from, to) => {
        renameSync(from, to);
    },
    write: (file, data) => {
        writeVerbatim(file, data);
    },
};

const cacheFolder = function cacheFolder(root: string, folder: string): string {
    return path.join(root, relativePath("toolCache", folder));
};

const hasFatal = function hasFatal(result: FixableResult): boolean {
    return result.messages.some((message) => message.fatal === true);
};

const errorCodeOf = function errorCodeOf(error: unknown): unknown {
    return typeof error === "object" && error !== null && "code" in error ? error.code : null;
};

const isTransient = function isTransient(error: unknown): boolean {
    const code = errorCodeOf(error);
    return typeof code === "string" && TRANSIENT_CODES.has(code);
};

const sleepSync = function sleepSync(ms: number): void {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(INT32_BYTES)), 0, 0, ms);
};

const attemptOnce = function attemptOnce(context: CommitContext): boolean {
    try {
        context.fs.write(context.temp, context.output);
        context.fs.rename(context.temp, context.file);
        return true;
    } catch (error) {
        context.fs.remove?.(context.temp);
        if (!isTransient(error)) {
            throw error;
        }
        return false;
    }
};

const fallbackWrite = function fallbackWrite(context: CommitContext): boolean {
    try {
        context.fs.write(context.file, context.output);
        return true;
    } catch (error) {
        if (!isTransient(error)) {
            throw error;
        }
        return false;
    }
};

const tempOf = function tempOf(fs: SafeFixFs, root: string, file: string): string {
    if (!isInsideRoot(root, file)) {
        throw new Error(outsideWorkspace(file, root));
    }
    const inside = path.relative(root, file);
    const temp = path.join(cacheFolder(root, TEMP_FOLDER), `${inside}${TEMP_SUFFIX}`);
    fs.ensureDir(path.dirname(temp));
    return temp;
};

const commitWrite = function commitWrite(fs: SafeFixFs, root: string, file: string, output: string): boolean {
    const context: CommitContext = { file, fs, output, temp: tempOf(fs, root, file) };
    for (const delay of RETRY_DELAYS_MS) {
        if (delay > NO_DELAY) {
            sleepSync(delay);
        }
        if (attemptOnce(context)) {
            return true;
        }
    }
    return fallbackWrite(context);
};

const writeBackup = function writeBackup(fs: SafeFixFs, entry: { file: string; original: string; root: string }): void {
    const backupPath = path.join(cacheFolder(entry.root, BACKUP_FOLDER), path.relative(entry.root, entry.file));
    fs.ensureDir(path.dirname(backupPath));
    fs.write(backupPath, entry.original);
};

const processFile = function processFile(fs: SafeFixFs, options: SafeFixOptions, result: FixableResult): FixAction {
    const file = result.filePath;
    if (hasFatal(result)) {
        return { file, kind: "skipped" };
    }
    if (options.dryRun === true) {
        return { file, kind: "pending" };
    }
    const original = fs.read(file);
    if (options.backup === true) {
        writeBackup(fs, { file, original, root: options.root });
    }
    return commitWrite(fs, options.root, file, result.output ?? original)
        ? { file, kind: "written", original }
        : { file, kind: "skipped" };
};

const filesOf = function filesOf(actions: readonly FixAction[], kind: FixAction["kind"]): string[] {
    return actions.filter((action) => action.kind === kind).map((action) => action.file);
};

const rollback = function rollback(fs: SafeFixFs, actions: readonly FixAction[]): void {
    for (const action of actions) {
        if (action.kind === "written" && typeof action.original === "string") {
            fs.write(action.file, action.original);
        }
    }
};

export const applyFixesSafely = function applyFixesSafely(
    results: readonly FixableResult[],
    options: SafeFixOptions,
): SafeFixOutcome {
    const fs = options.fs ?? NODE_FS;
    const actions: FixAction[] = [];
    try {
        for (const result of results.filter((entry) => typeof entry.output === "string")) {
            actions.push(processFile(fs, options, result));
        }
    } catch (error) {
        rollback(fs, actions);
        throw error;
    }
    return {
        pending: filesOf(actions, "pending"),
        skipped: filesOf(actions, "skipped"),
        written: filesOf(actions, "written"),
    };
};
