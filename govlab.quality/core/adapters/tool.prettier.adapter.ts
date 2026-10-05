import { isRecord, stringArrayField } from "#core/selectors/record.selector";
import { toolCacheDir, writeToolFile, writeToolJson } from "#core/persistence/tool.persistence";
import { POSITION } from "#configuration/constants/tool.constants";
import type { RunResult } from "#types/finding.types";
import type { RunnerContext } from "#types/tool.types";
import { createRequire } from "node:module";
import { defineTool } from "#core/registries/tool.registry";
import { emitPrettierConfig } from "#core/emitters/tool.prettier.emitter";
import { exclusionsFrom } from "#core/converters/exclusions.converter";
import { isInsideRoot } from "#core/predicates/location.predicate";
import { loadGovlabConfig } from "#core/loaders/config.loader";
import path from "node:path";
import { prettierFailed } from "#configuration/strings/tool.strings";
import process from "node:process";
import { sectionOf } from "#core/selectors/config.selector";
import { spawn } from "node:child_process";
import { superviseChild } from "#core/lifecycle/invocation.lifecycle";
import { toolFinding } from "#core/factories/finding.factory";
import { validConcepts } from "#core/selectors/concept.selector";
import { validateConcerns } from "#core/validators/concern.validator";
import { withMasterExclude } from "#core/selectors/exclusions.selector";

const SECTION = "prettier";
const FAILED_EXIT = 1;
const moduleRequire = createRequire(import.meta.url);

const prettierBin = function prettierBin(): string {
    return path.join(path.dirname(moduleRequire.resolve("prettier/package.json")), "bin", "prettier.cjs");
};

export const govlabPrettierConfig = async (consumerRoot: string = process.cwd()): Promise<Record<string, unknown>> => {
    const config = await loadGovlabConfig(consumerRoot);
    const section = sectionOf(config, SECTION);
    const concerns = validateConcerns(config.qualityMaster?.concerns ?? {}, validConcepts());
    return emitPrettierConfig({ base: isRecord(section["base"]) ? section["base"] : undefined, concerns });
};

export const govlabPrettierIgnore = async (consumerRoot: string = process.cwd()): Promise<string[]> => {
    const config = await loadGovlabConfig(consumerRoot);
    return withMasterExclude(config, stringArrayField(sectionOf(config, SECTION), "ignore"));
};

interface PrettierRun {
    readonly ignorePath: string;
    readonly paths: readonly string[];
}

const prettierRuns = async function prettierRuns(context: RunnerContext): Promise<readonly PrettierRun[]> {
    const dir = toolCacheDir(context.root, SECTION);
    const exclusions = exclusionsFrom(await govlabPrettierIgnore(context.root), dir, context.root);
    const inside = context.paths.filter((target) => isInsideRoot(context.root, target));
    const outside = context.paths.filter((target) => !isInsideRoot(context.root, target));
    return [
        { ignorePath: writeToolFile(context.root, path.join(SECTION, "ignore"), exclusions.join("\n")), paths: inside },
        { ignorePath: writeToolFile(context.root, path.join(SECTION, "outside.ignore"), ""), paths: outside },
    ].filter((run) => run.paths.length > 0);
};

const prettierArgs = function prettierArgs(context: RunnerContext, configPath: string, run: PrettierRun): string[] {
    return [
        prettierBin(),
        "--config",
        configPath,
        "--ignore-path",
        run.ignorePath,
        "--cache",
        "--cache-location",
        path.join(toolCacheDir(context.root, SECTION), "cache"),
        "--no-error-on-unmatched-pattern",
        "--log-level",
        "log",
        context.fix ? "--write" : "--check",
        ...run.paths,
    ];
};

const exitOf = async function exitOf(root: string, args: readonly string[]): Promise<number> {
    return new Promise<number>((resolve) => {
        const child = spawn(process.execPath, args, { cwd: root, stdio: "inherit" });
        superviseChild(child);
        child.on("error", () => {
            resolve(FAILED_EXIT);
        });
        child.on("close", (exit) => {
            resolve(exit ?? FAILED_EXIT);
        });
    });
};

export const runPrettier = async function runPrettier(context: RunnerContext): Promise<RunResult> {
    const configPath = await writeToolJson(
        context.root,
        path.join(SECTION, "config.json"),
        await govlabPrettierConfig(context.root),
    );
    const runs = await prettierRuns(context);
    const code = await runs.reduce<Promise<number>>(async (previous, run) => {
        const prior = await previous;
        const exit = await exitOf(context.root, prettierArgs(context, configPath, run));
        return prior === 0 ? exit : prior;
    }, Promise.resolve(0));
    const failure = toolFinding({
        column: POSITION,
        ecosystem: context.ecosystem,
        file: "",
        line: POSITION,
        message: prettierFailed(code),
        ruleId: "prettier/format",
        tool: SECTION,
    });
    return { findings: code === 0 ? [] : [failure], fixedCount: 0, output: "" };
};

defineTool({ ecosystems: ["javascript", "typescript", "css", "json"], run: runPrettier, tool: SECTION });
