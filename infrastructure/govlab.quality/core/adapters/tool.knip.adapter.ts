import { findingsResult, signalDeathResult } from "#core/factories/finding.factory";
import { isRecord, stringArrayField, stringArrayFieldOr } from "#core/selectors/record.selector";
import { masterExcludeMarkers, withMasterExclude } from "#core/selectors/exclusions.selector";
import { safeReaddir, safeStat } from "#core/loaders/source.loader";
import type { PathExclusion } from "#types/exclusions.types";
import type { RunResult } from "#types/finding.types";
import type { RunnerContext } from "#types/tool.types";
import { createRequire } from "node:module";
import { defineTool } from "#core/registries/tool.registry";
import { existsSync } from "node:fs";
import { forwardSlashed } from "#core/converters/filename.converter";
import { loadGovlabConfig } from "#core/loaders/config.loader";
import { parseKnipOutput } from "#core/parsers/tool.knip.parser";
import path from "node:path";
import { pathExclusion } from "#core/matchers/exclusions.matcher";
import process from "node:process";
import { sectionOf } from "#core/selectors/config.selector";
import { signalKilled } from "#core/predicates/failure.predicate";
import { spawnTool } from "#core/adapters/invocation.adapter";
import { workspaceDirs } from "#core/loaders/package.loader";
import { writeToolJson } from "#core/persistence/tool.persistence";

const SECTION = "knip";
const CONFIG_FILE = "knip.json";
const moduleRequire = createRequire(import.meta.url);
const DEFAULT_BARRELS = ["index.ts"];
const BIN_FOLDER = "bin";
const BIN_ENTRY = "bin/**/*.{ts,mjs}";
const MJS_EXTENSION = ".mjs";
const MJS_ENTRY = "**/*.mjs";
const TS_PROJECT = ["**/*.ts"];
const MIXED_PROJECT = ["**/*.ts", "**/*.mjs"];

const isDir = (target: string): boolean => safeStat(target)?.isDirectory() ?? false;

const namesIn = (dir: string): string[] => safeReaddir(dir).map((entry) => entry.name);

const containsMjs = (dir: string, excluded: PathExclusion): boolean =>
    namesIn(dir)
        .map((name) => `${dir}/${name}`)
        .filter((full) => !excluded(full))
        .some((full) => (isDir(full) ? containsMjs(full, excluded) : full.endsWith(MJS_EXTENSION)));

const entriesFor = (dir: string, rel: string, section: Record<string, unknown>, hasMjs: boolean): string[] => {
    const extras = isRecord(section["entryExtras"]) ? stringArrayField(section["entryExtras"], rel) : [];
    return [
        ...stringArrayFieldOr(section, "barrels", DEFAULT_BARRELS).filter((barrel) => existsSync(`${dir}/${barrel}`)),
        ...(isDir(`${dir}/${BIN_FOLDER}`) ? [BIN_ENTRY] : []),
        ...(hasMjs ? [MJS_ENTRY] : []),
        ...extras,
    ];
};

const packageWorkspaces = (
    consumerRoot: string,
    section: Record<string, unknown>,
    excluded: PathExclusion,
): [string, unknown][] =>
    workspaceDirs(consumerRoot).map((dir) => {
        const rel = forwardSlashed(path.relative(consumerRoot, dir));
        const hasMjs = containsMjs(rel, excluded);
        return [rel, { entry: entriesFor(rel, rel, section, hasMjs), project: hasMjs ? MIXED_PROJECT : TS_PROJECT }];
    });

export const govlabKnipConfig = async (consumerRoot: string = process.cwd()): Promise<Record<string, unknown>> => {
    const config = await loadGovlabConfig(consumerRoot);
    const section = sectionOf(config, SECTION);
    const excluded = pathExclusion(consumerRoot, masterExcludeMarkers(config));
    const shared = isRecord(section["sharedWorkspaces"]) ? Object.entries(section["sharedWorkspaces"]) : [];
    const rootWorkspace: [string, unknown] = [
        ".",
        { entry: stringArrayField(section, "rootEntry"), project: stringArrayField(section, "rootProject") },
    ];
    return {
        ignore: withMasterExclude(config, stringArrayField(section, "ignore")),
        ignoreBinaries: stringArrayField(section, "ignoreBinaries"),
        ignoreDependencies: stringArrayField(section, "ignoreDependencies"),
        ignoreWorkspaces: stringArrayField(section, "ignoreWorkspaces"),
        paths: isRecord(section["paths"]) ? section["paths"] : {},
        tags: stringArrayField(section, "tags"),
        workspaces: Object.fromEntries([
            rootWorkspace,
            ...shared,
            ...packageWorkspaces(consumerRoot, section, excluded),
        ]),
    };
};

const knipBin = function knipBin(): string {
    return path.resolve(path.dirname(moduleRequire.resolve(SECTION)), "..", "bin", "knip.ts");
};

const runKnip = async function runKnip(context: RunnerContext): Promise<RunResult> {
    const configFile = await writeToolJson(context.root, CONFIG_FILE, await govlabKnipConfig(context.root));
    const args = [knipBin(), "--config", configFile, "--no-progress", "--reporter", "json"];
    const result = spawnTool(process.execPath, args, { cwd: context.root, encoding: "utf8", shell: false });
    if (signalKilled(result.status)) {
        return signalDeathResult({ ecosystem: context.ecosystem, root: context.root, tool: SECTION }, result.signal);
    }
    return findingsResult(parseKnipOutput(result.stdout, context.ecosystem));
};

defineTool({ ecosystems: ["javascript", "typescript"], run: runKnip, tool: SECTION });
