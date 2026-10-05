import {
    ENTRYPOINT_FILES,
    ERROR_PREVIEW_LEN,
    FAILURE_EXIT,
    FLAG_NAMES,
    JOB_TIMEOUT_MS,
    LIST_SEPARATOR,
    LIST_TIMEOUT_MS,
    MAX_CONCURRENCY,
    MIN_CONCURRENCY,
    RESERVED_SLOTS,
    WORKSPACE_MAP_ID,
} from "#configuration/constants/invocation.constants";
import { ROOT, absolutePath } from "@ssot/paths";
import {
    WORKSPACE_MAP_SUFFIX,
    chunkLabel,
    listFailed,
    parallelPlan,
    parallelSummary,
} from "#configuration/strings/invocation.strings";
import { cacheForced, createDocIndex, moduleKey, selectStaleModules, workspaceMapKey } from "#core/caches/readme.cache";
import { hasFlag, resolveArgv } from "@govlab/argv";
import type { JobResult } from "#types/index.types";
import { README_ARGV } from "#configuration/configs/invocation.config";
import { countSourceFiles } from "#core/counters/source.counter";
import { cpus } from "node:os";
import { join } from "node:path";
import { longestProcessingTimeBuckets } from "#core/schedulers/base.scheduler";
import process from "node:process";
import { superviseJob } from "#core/adapters/shell.adapter";

const LINE_BREAK = "\n";

const argv = resolveArgv(README_ARGV);
const mode = [FLAG_NAMES.fix, FLAG_NAMES.all].find((flag) => hasFlag(argv, flag)) ?? FLAG_NAMES.check;
const packageScript = join(absolutePath("govlab.docs.entrypoints"), ENTRYPOINT_FILES.package);

const runPackageJob = async function runPackageJob(args: readonly string[], label: string): Promise<JobResult> {
    return superviseJob({
        args: [packageScript, mode, ...args],
        command: process.execPath,
        cwd: ROOT,
        label,
        timeoutMs: JOB_TIMEOUT_MS,
    });
};

const listModules = async function listModules(): Promise<string[]> {
    const listing = await superviseJob({
        args: [packageScript, FLAG_NAMES.list],
        command: process.execPath,
        cwd: ROOT,
        label: FLAG_NAMES.list,
        timeoutMs: LIST_TIMEOUT_MS,
    });
    if (listing.code !== 0) {
        throw new Error(listFailed(listing.out.slice(0, ERROR_PREVIEW_LEN)));
    }
    return listing.out
        .split(LINE_BREAK)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
};

const concurrency = Math.min(MAX_CONCURRENCY, Math.max(MIN_CONCURRENCY, cpus().length - RESERVED_SLOTS));
const modules = await listModules();
const selective = mode === FLAG_NAMES.all;
const docIndex = createDocIndex(cacheForced(process.env));
const keyByModule = new Map(modules.map((rel) => [rel, moduleKey(rel, modules)]));
const workspaceKey = workspaceMapKey(modules);
const changed = selective ? selectStaleModules(docIndex, modules, keyByModule) : [...modules];
const doWorkspaceMap = !selective || !docIndex.unchanged(WORKSPACE_MAP_ID, workspaceKey);
const chunks = longestProcessingTimeBuckets(
    changed.map((rel) => ({ cost: countSourceFiles(join(ROOT, rel)), id: rel })),
    concurrency,
);
const mapSuffix = doWorkspaceMap ? WORKSPACE_MAP_SUFFIX : "";
const unchanged = modules.length - changed.length;

process.stderr.write(
    parallelPlan({
        changed: changed.length,
        chunks: chunks.length,
        map: mapSuffix,
        mode,
        modules: modules.length,
        unchanged,
    }),
);

const results = await Promise.all([
    ...chunks.map(async (chunk, index) =>
        runPackageJob([FLAG_NAMES.only, chunk.join(LIST_SEPARATOR)], chunkLabel(index)),
    ),
    ...(doWorkspaceMap ? [runPackageJob([FLAG_NAMES.workspaceMapOnly], WORKSPACE_MAP_ID)] : []),
]);

for (const result of results) {
    process.stdout.write(result.out.endsWith(LINE_BREAK) ? result.out : `${result.out}${LINE_BREAK}`);
}
const failed = results.filter((result) => result.code !== 0).length;

if (selective && failed === 0) {
    for (const rel of changed) {
        docIndex.update(rel, keyByModule.get(rel) ?? "");
    }
    if (doWorkspaceMap) {
        docIndex.update(WORKSPACE_MAP_ID, workspaceKey);
    }
    docIndex.flush();
}

process.stdout.write(parallelSummary({ chunks: chunks.length, failed, map: mapSuffix, unchanged }));
process.exitCode = failed > 0 ? FAILURE_EXIT : 0;
