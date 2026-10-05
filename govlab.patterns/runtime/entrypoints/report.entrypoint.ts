import {
    FAILURE_EXIT,
    LIST_SEPARATOR,
    NO_CACHE_ENV,
    NO_CACHE_ON,
    REPORT_FLAG_NAMES,
} from "#configuration/constants/invocation.constants";
import { HEAL_ATTEMPTS, HTML_SUFFIX, SLUG_JOIN } from "#configuration/constants/report.constants";
import { HEAL_NOTES, healNote, moduleDrift, moduleWritten, writeSummary } from "#configuration/strings/report.strings";
import type { ModuleArtifacts, ModuleSvgs, ModuleTitle } from "#types/report.types";
import type { ModuleScope, RepoContext } from "#types/package.types";
import { ROOT, absolutePath, relativePath } from "@ssot/paths";
import { basename, resolve } from "node:path";
import { buildContext, emptyContext } from "#core/factories/context.factory";
import { discoverModules, sourceFiles, testFilesOf } from "#core/loaders/package.loader";
import { flagValue, hasFlag, resolveArgv } from "@govlab/argv";
import { healModule, runHexCheck } from "#core/coordinators/report.coordinator";
import { hexArtifactsExist, moduleFingerprint, openReportCache } from "#core/caches/report.cache";
import { loadGovlabConfig, masterExcludeMarkers, pathExclusion } from "@govlab/quality/config";
import { persistArtifacts, writeHexMaster, writeSvgCollection } from "#core/persistence/report.persistence";
import { REPORT_ARGV } from "#configuration/configs/invocation.config";
import { buildModuleReport } from "#core/coordinators/package.coordinator";
import { checkHexMaster } from "#core/validators/report.validator";
import { defineCheck } from "@govlab/context/check";
import process from "node:process";
import { settleParses } from "#core/loaders/source.loader";
import { titleFor } from "#core/resolvers/package.resolver";

defineCheck({ detects: [], enforces: ["architecture:reproducibility"] });

const argv = resolveArgv(REPORT_ARGV);
const ignored = (flagValue(argv, REPORT_FLAG_NAMES.ignore) ?? "")
    .split(LIST_SEPARATOR)
    .filter((entry) => entry.length > 0);
const markers = masterExcludeMarkers(await loadGovlabConfig(process.cwd()));
const pruned = pathExclusion(process.cwd(), [...markers, ...ignored]);
const masterPath = absolutePath("projectInfo.findings");
const cache = openReportCache(process.env[NO_CACHE_ENV] === NO_CACHE_ON);

const scope: ModuleScope = { pruned, root: ROOT };

const titleOf = function titleOf(moduleDir: string): string {
    return titleFor(ROOT, moduleDir);
};

const pool = async function pool(items: readonly string[], worker: (item: string) => Promise<void>): Promise<void> {
    await items.reduce(async (queued, item) => {
        await queued;
        await worker(item);
    }, Promise.resolve());
};

const artifactsFor = async function artifactsFor(moduleDir: string, ctx: RepoContext): Promise<ModuleArtifacts> {
    const { built, title } = await buildModuleReport(moduleDir, ctx, scope);
    const artifacts = new Map<string, string>([
        ...[...built.pages].map(([base, html]): [string, string] => [`${base}.generated${HTML_SUFFIX}`, html]),
        [basename(relativePath("moduleInfo.analysis")), built.analysis],
        [basename(relativePath("moduleInfo.findings")), built.findings],
        [basename(relativePath("moduleInfo.report")), JSON.stringify(built.report)],
    ]);
    return { artifacts, findings: { findings: built.findingsData, module: title }, svgs: built.svgs };
};

const svgUnits = function svgUnits(byModule: ReadonlyMap<string, ReadonlyMap<string, string>>): ModuleSvgs[] {
    return [...byModule].map(([moduleDir, svgs]) => ({ slug: titleOf(moduleDir).split("/").join(SLUG_JOIN), svgs }));
};

const knownSlugs = function knownSlugs(modules: readonly string[]): Set<string> {
    return new Set(modules.map((dir) => titleOf(dir).split("/").join(SLUG_JOIN)));
};

const titles = function titles(modules: readonly string[]): ModuleTitle[] {
    return modules.map((dir) => ({ dir, title: titleOf(dir) }));
};

const writeModule = async function writeModule(moduleDir: string, ctx: RepoContext): Promise<Map<string, string>> {
    const { artifacts, svgs } = await artifactsFor(moduleDir, ctx);
    persistArtifacts(moduleDir, artifacts);
    process.stdout.write(moduleWritten(titleOf(moduleDir), artifacts.size));
    return svgs;
};

const writeAll = async function writeAll(modules: readonly string[], ctx: RepoContext): Promise<void> {
    const svgs = new Map<string, Map<string, string>>();
    await pool(modules, async (moduleDir) => {
        const fanIn = [...ctx.fanIn].filter(([key]) => key.startsWith(`${moduleDir}::`));
        const files = [...sourceFiles(moduleDir, pruned), ...testFilesOf(moduleDir, pruned)];
        const key = moduleFingerprint(files, fanIn, ctx.importCycles.get(moduleDir) ?? []);
        if (!cache.unchanged(moduleDir, key) || !hexArtifactsExist(moduleDir)) {
            svgs.set(moduleDir, await writeModule(moduleDir, ctx));
            cache.update(moduleDir, key);
        }
    });
    writeSvgCollection(ROOT, svgUnits(svgs), knownSlugs(modules));
    writeHexMaster(masterPath, titles(modules));
    cache.flush();
    process.stdout.write(writeSummary(svgs.size, modules.length));
};

const runAll = async function runAll(check: boolean): Promise<void> {
    const modules = discoverModules(ROOT, pruned);
    const ctx = await buildContext(modules, scope);
    if (!check) {
        await writeAll(modules, ctx);
        return;
    }
    await runHexCheck({
        attempts: HEAL_ATTEMPTS,
        async generate(moduleDir) {
            return artifactsFor(moduleDir, ctx);
        },
        masterOk(collected) {
            return checkHexMaster(masterPath, collected);
        },
        modules,
        pool,
        reparse: settleParses,
        title: titleOf,
        writeMaster() {
            writeHexMaster(masterPath, titles(modules));
        },
        writeSvgs(byModule) {
            writeSvgCollection(ROOT, svgUnits(byModule), knownSlugs(modules));
        },
    });
};

const runOne = async function runOne(moduleDir: string, check: boolean, fast: boolean): Promise<void> {
    const ctx = fast ? emptyContext() : await buildContext(discoverModules(ROOT, pruned), scope);
    if (!check) {
        await writeModule(moduleDir, ctx);
        return;
    }
    const result = await healModule(moduleDir, {
        attempts: HEAL_ATTEMPTS,
        async generate(dir) {
            return artifactsFor(dir, ctx);
        },
        reparse: settleParses,
    });
    if (result.state === "drift") {
        process.stderr.write(moduleDrift(moduleDir));
        process.exitCode = FAILURE_EXIT;
        return;
    }
    process.stdout.write(healNote(HEAL_NOTES[result.state]));
};

const check = hasFlag(argv, REPORT_FLAG_NAMES.check);
const target = resolve(argv.positionals[0] ?? ".");

await (hasFlag(argv, REPORT_FLAG_NAMES.all)
    ? runAll(check)
    : runOne(target, check, hasFlag(argv, REPORT_FLAG_NAMES.fast)));
