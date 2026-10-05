import type { Finding, RunResult } from "#types/finding.types";
import { existsSync, readFileSync, statSync } from "node:fs";
import { isRecord, stringArrayField } from "#core/selectors/record.selector";
import { safeReaddir, safeStat } from "#core/loaders/source.loader";
import { MISSING_VERIFY } from "#configuration/strings/tool.strings";
import type { PathExclusion } from "#types/exclusions.types";
import type { RunnerContext } from "#types/tool.types";
import { createRequire } from "node:module";
import { defineTool } from "#core/registries/tool.registry";
import { excludeMatcher } from "#core/factories/exclusions.factory";
import { findingsResult } from "#core/factories/finding.factory";
import { loadGovlabConfig } from "#core/loaders/config.loader";
import path from "node:path";
import process from "node:process";
import { sectionOf } from "#core/selectors/config.selector";
import { withMasterExclude } from "#core/selectors/exclusions.selector";

const SECTION = "htmlhint";
const HTML_EXTENSION = ".html";
const WILDCARD = "*";

interface HtmlhintMessage {
    col: number;
    line: number;
    message: string;
    rule: { id: string };
    type: string;
}

type HtmlhintVerify = (html: string, ruleset?: Record<string, unknown>) => HtmlhintMessage[];

const isVerify = function isVerify(value: unknown): value is HtmlhintVerify {
    return typeof value === "function";
};

const loadVerify = function loadVerify(): HtmlhintVerify {
    const loaded: unknown = createRequire(import.meta.url)(SECTION);
    const api = isRecord(loaded) ? loaded["HTMLHint"] : undefined;
    const verify = isRecord(api) ? api["verify"] : undefined;
    if (!isVerify(verify)) {
        throw new Error(MISSING_VERIFY);
    }
    return (html, ruleset) => verify.call(api, html, ruleset);
};

export const govlabHtmlhintConfig = async function govlabHtmlhintConfig(
    consumerRoot: string = process.cwd(),
): Promise<{ rules: Record<string, unknown>; ignore: string[] }> {
    const config = await loadGovlabConfig(consumerRoot);
    const section = sectionOf(config, SECTION);
    return {
        ignore: withMasterExclude(config, stringArrayField(section, "ignore")),
        rules: isRecord(section["rules"]) ? section["rules"] : {},
    };
};

const isIgnored = function isIgnored(file: string, ignore: readonly string[]): boolean {
    const normalized = file.split(path.sep).join("/");
    return ignore.some((entry) => normalized.includes(entry.split(WILDCARD).join("")));
};

interface Walk {
    excluded: PathExclusion;
    ignore: readonly string[];
}

const walk = function walk(dir: string, scan: Walk): string[] {
    return safeReaddir(dir)
        .map((entry) => path.join(dir, entry.name))
        .filter((full) => !scan.excluded(full))
        .flatMap((full): string[] => {
            const stat = safeStat(full);
            if (stat === null) {
                return [];
            }
            if (stat.isDirectory()) {
                return walk(full, scan);
            }
            return full.endsWith(HTML_EXTENSION) && !isIgnored(full, scan.ignore) ? [full] : [];
        });
};

const baseDir = function baseDir(entry: string): string {
    const star = entry.indexOf(WILDCARD);
    const trimmed = star === -1 ? entry : entry.slice(0, star);
    const sep = trimmed.lastIndexOf("/");
    return sep === -1 ? "." : trimmed.slice(0, sep);
};

const entryTargets = function entryTargets(root: string, entry: string, scan: Walk): string[] {
    if (!entry.includes(WILDCARD) && entry.endsWith(HTML_EXTENSION)) {
        return [path.resolve(root, entry)];
    }
    const dir = path.resolve(root, baseDir(entry));
    return existsSync(dir) && statSync(dir).isDirectory() ? walk(dir, scan) : [];
};

const runHtmlhint = async function runHtmlhint(context: RunnerContext): Promise<RunResult> {
    const { rules, ignore } = await govlabHtmlhintConfig(context.root);
    const scan: Walk = { excluded: await excludeMatcher(context.root), ignore };
    const verify = loadVerify();
    const files = [...new Set(context.paths.flatMap((entry) => entryTargets(context.root, entry, scan)))];
    const findings = files.flatMap((file): Finding[] =>
        verify(readFileSync(file, "utf8"), rules).map((message) => ({
            advisory: false,
            column: message.col,
            ecosystem: context.ecosystem,
            file,
            fixable: false,
            line: message.line,
            message: message.message,
            ruleId: message.rule.id,
            severity: "error",
            tool: SECTION,
        })),
    );
    return findingsResult(findings);
};

defineTool({ ecosystems: ["html"], run: runHtmlhint, tool: SECTION });
