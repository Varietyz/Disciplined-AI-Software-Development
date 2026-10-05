import type { AdvisoryContext, RunnerContext, ScanSpec, ToolCall } from "#types/tool.types";
import { NO_STDERR_DETAIL, installHint, toolErrorMessage } from "#configuration/strings/tool.strings";
import { fixCycle, passTool, residualOf } from "#core/adapters/tool.adapter";
import { isRecord, stringArrayField, stringArrayFieldOr } from "#core/selectors/record.selector";
import { notInstalled, toolFailure } from "#core/factories/finding.factory";
import { FINDING_STATUSES } from "#configuration/constants/tool.constants";
import type { OxlintBlockExclusion } from "#types/config.types";
import type { RunResult } from "#types/finding.types";
import { createRequire } from "node:module";
import { defineTool } from "#core/registries/tool.registry";
import { failedWhenEmpty } from "#core/classifiers/invocation.classifier";
import { filterBlockExcluded } from "#core/selectors/block.selector";
import { gatingAdvisory } from "#core/factories/tool.factory";
import { isModuleMissing } from "#core/predicates/failure.predicate";
import { loadGovlabConfig } from "#core/loaders/config.loader";
import { parseOxlintOutput } from "#core/parsers/tool.oxlint.parser";
import path from "node:path";
import process from "node:process";
import { sectionOf } from "#core/selectors/config.selector";
import { tailLines } from "#core/selectors/failure.selector";
import { withMasterExclude } from "#core/selectors/exclusions.selector";
import { writeToolJson } from "#core/persistence/tool.persistence";

const SECTION = "oxlint";
const RULE_OFF = "off";
const DEFAULT_ENV = { builtin: true };
const CONFIG_FILE = "oxlintrc.json";
const FIX_CONFIG_FILE = "oxlintrc.fix.json";
const moduleRequire = createRequire(import.meta.url);

interface Invocation {
    bin: string;
    configFile: string;
    fixConfigFile: string;
    ignore: string[];
}

const recordOr = function recordOr(value: unknown, fallback: Record<string, unknown>): Record<string, unknown> {
    return isRecord(value) ? value : fallback;
};

export const govlabOxlintConfig = async (consumerRoot: string = process.cwd()): Promise<Record<string, unknown>> => {
    const config = await loadGovlabConfig(consumerRoot);
    const section = sectionOf(config, SECTION);
    return {
        categories: recordOr(section["categories"], {}),
        env: recordOr(section["env"], DEFAULT_ENV),
        globals: recordOr(section["globals"], {}),
        ignorePatterns: withMasterExclude(config, stringArrayField(section, "ignorePatterns")),
        plugins: stringArrayFieldOr(section, "plugins", []),
        rules: recordOr(section["rules"], {}),
    };
};

export const govlabOxlintFixConfig = async (consumerRoot: string = process.cwd()): Promise<Record<string, unknown>> => {
    const config = await loadGovlabConfig(consumerRoot);
    const section = sectionOf(config, SECTION);
    const silenced = Object.fromEntries(stringArrayField(section, "reportOnly").map((rule) => [rule, RULE_OFF]));
    return { ...(await govlabOxlintConfig(consumerRoot)), rules: { ...recordOr(section["rules"], {}), ...silenced } };
};

const resolveOxlintBin = function resolveOxlintBin(): string | null {
    try {
        return path.resolve(path.dirname(moduleRequire.resolve(SECTION)), "..", "bin", SECTION);
    } catch (error) {
        if (isModuleMissing(error)) {
            return null;
        }
        throw error;
    }
};

const oxlintCall = function oxlintCall(invocation: Invocation, context: RunnerContext, withFix: boolean): ToolCall {
    const args = [
        invocation.bin,
        "--type-aware",
        "--disable-nested-config",
        "-c",
        withFix ? invocation.fixConfigFile : invocation.configFile,
        "-f",
        "json",
        ...invocation.ignore.flatMap((pattern) => ["--ignore-pattern", pattern]),
        ...(withFix ? ["--fix"] : []),
        ...context.paths,
    ];
    return { args, bin: process.execPath, cwd: context.root };
};

const oxlintSpec = function oxlintSpec(
    advisory: AdvisoryContext,
    exclusions: readonly OxlintBlockExclusion[],
): ScanSpec {
    return {
        failed: failedWhenEmpty(FINDING_STATUSES),
        failure: (exit) =>
            toolFailure(advisory, toolErrorMessage(SECTION, exit.status, tailLines(exit.stderr, NO_STDERR_DETAIL))),
        parse: (result) =>
            filterBlockExcluded(parseOxlintOutput(result.stdout, advisory.ecosystem), exclusions, advisory.root),
    };
};

export const runOxlint = async function runOxlint(context: RunnerContext): Promise<RunResult> {
    const advisory = gatingAdvisory(context, SECTION, installHint(SECTION));
    const bin = resolveOxlintBin();
    if (bin === null) {
        return notInstalled(advisory);
    }
    const config = await govlabOxlintConfig(context.root);
    const invocation: Invocation = {
        bin,
        configFile: await writeToolJson(context.root, CONFIG_FILE, config),
        fixConfigFile: await writeToolJson(context.root, FIX_CONFIG_FILE, await govlabOxlintFixConfig(context.root)),
        ignore: stringArrayField(config, "ignorePatterns"),
    };
    const spec = oxlintSpec(advisory, (await loadGovlabConfig(context.root)).oxlint?.blockExclusions ?? []);
    return fixCycle(
        passTool(advisory, oxlintCall(invocation, context, false), spec),
        (findings) => context.fix && findings.length > 0,
        (reported) => {
            const fixed = passTool(advisory, oxlintCall(invocation, context, true), spec);
            return fixed.terminal
                ? fixed.result
                : residualOf(reported, passTool(advisory, oxlintCall(invocation, context, false), spec));
        },
    );
};

defineTool({ ecosystems: ["typescript"], run: runOxlint, tool: SECTION });
