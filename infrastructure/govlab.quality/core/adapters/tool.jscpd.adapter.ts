import { existsSync, renameSync, rmSync } from "node:fs";
import { findingsResult, signalDeathResult } from "#core/factories/finding.factory";
import { numberField, stringArrayField, stringArrayFieldOr, stringField } from "#core/selectors/record.selector";
import type { RunResult } from "#types/finding.types";
import type { RunnerContext } from "#types/tool.types";
import { createRequire } from "node:module";
import { defineTool } from "#core/registries/tool.registry";
import { loadGovlabConfig } from "#core/loaders/config.loader";
import { parseJscpdOutput } from "#core/parsers/tool.jscpd.parser";
import path from "node:path";
import process from "node:process";
import { relativePath } from "@ssot/paths";
import { sectionOf } from "#core/selectors/config.selector";
import { signalKilled } from "#core/predicates/failure.predicate";
import { spawnTool } from "#core/adapters/invocation.adapter";
import { withMasterExclude } from "#core/selectors/exclusions.selector";
import { writeToolJson } from "#core/persistence/tool.persistence";

const SECTION = "jscpd";
const CONFIG_FILE = "jscpd.json";
const REPORTER_FILE = "jscpd-report.json";
const DEFAULT_THRESHOLD = 0;
const DEFAULT_MIN_TOKENS = 50;
const DEFAULT_MIN_LINES = 5;
const DEFAULT_FORMATS = ["typescript", "javascript", "css", "html"];
const REPORTERS = ["json"];

const moduleRequire = createRequire(import.meta.url);

export const govlabJscpdConfig = async (consumerRoot: string = process.cwd()): Promise<Record<string, unknown>> => {
    const config = await loadGovlabConfig(consumerRoot);
    const section = sectionOf(config, SECTION);
    return {
        absolute: section["absolute"] !== false,
        format: stringArrayFieldOr(section, "format", DEFAULT_FORMATS),
        ignore: withMasterExclude(config, stringArrayField(section, "ignore")),
        minLines: numberField(section, "minLines", DEFAULT_MIN_LINES),
        minTokens: numberField(section, "minTokens", DEFAULT_MIN_TOKENS),
        output: stringField(section, "output", relativePath("govlabHost.reports")),
        reporters: REPORTERS,
        threshold: numberField(section, "threshold", DEFAULT_THRESHOLD),
    };
};

const jscpdBin = function jscpdBin(): string {
    return path.resolve(path.dirname(moduleRequire.resolve("jscpd/package.json")), "run-jscpd.js");
};

const settleArtifact = function settleArtifact(root: string): void {
    const declared = path.join(root, relativePath("govlabHost.reports.duplication"));
    const written = path.join(path.dirname(declared), REPORTER_FILE);
    if (existsSync(written)) {
        rmSync(declared, { force: true });
        renameSync(written, declared);
    }
};

const runJscpd = async function runJscpd(context: RunnerContext): Promise<RunResult> {
    const configFile = await writeToolJson(context.root, CONFIG_FILE, await govlabJscpdConfig(context.root));
    const args = [jscpdBin(), "--config", configFile, "--reporters", "json", "--silent", ...context.paths];
    const result = spawnTool(process.execPath, args, { cwd: context.root, encoding: "utf8", shell: false });
    settleArtifact(context.root);
    if (signalKilled(result.status)) {
        return signalDeathResult({ ecosystem: context.ecosystem, root: context.root, tool: SECTION }, result.signal);
    }
    return findingsResult(parseJscpdOutput(result.stdout, context.ecosystem));
};

defineTool({ ecosystems: ["javascript", "typescript", "css", "html"], run: runJscpd, tool: SECTION });
