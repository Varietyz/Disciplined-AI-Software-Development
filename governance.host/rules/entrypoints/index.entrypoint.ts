import { DECLARING_CALLEE, declarationsIn } from "../../shared/analyzers/check.analyzer.ts";
import { ROOT, absolutePath, relativePath } from "@ssot/paths";
import {
    budgetLine,
    budgetNotNumber,
    checksLine,
    indexedLine,
    markersLine,
    stylesheetIndexedLine,
    unreadableDeclaration,
} from "../../shared/strings/rule.strings.ts";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { loadGovlabConfig, masterExcludeMarkers, pathExclusion } from "@govlab/quality/config";
import { filesUnder } from "../../codemods/analyzers/word.analyzer.ts";
import { labelOf } from "../../shared/resolvers/anchor.resolver.ts";
import { writeVerbatim } from "@govlab/canonical-write";

const ESLINT_DIR = absolutePath("govlabHost.rules");
const GENERATED_DIR = absolutePath("govlabHost.generated");
const OUT = join(GENERATED_DIR, "rule-index.generated.ts");
const IMPORT_PREFIX = relative(GENERATED_DIR, ESLINT_DIR).split("\\").join("/");
const SEVERITY = "error";

const HEADER = "";

const isRuleSource = function isRuleSource(name: string): boolean {
    if (!name.endsWith(".ts")) {
        return false;
    }
    if (name.startsWith("_")) {
        return false;
    }
    if (name.endsWith(".generated.ts")) {
        return false;
    }
    return true;
};

const isRule = function isRule(text: string): boolean {
    return text.includes("meta:") && text.includes("create(");
};

const isPluginWrapper = function isPluginWrapper(text: string): boolean {
    return text.includes("export default {") && text.includes("plugins:");
};

const identifierOf = function identifierOf(label: string): string {
    const parts = label.split("-").flatMap((segment) => segment.split("."));
    const head = parts[0] ?? label;
    const tail = parts.slice(1).map((p) => p.charAt(0).toUpperCase() + p.slice(1));
    return head + tail.join("");
};

const sources = readdirSync(ESLINT_DIR)
    .filter((name) => isRuleSource(name))
    .toSorted((a, b) => a.localeCompare(b))
    .map((name) => {
        const withoutExt = name.slice(0, -3);
        return { label: labelOf(withoutExt), stem: withoutExt, text: readFileSync(join(ESLINT_DIR, name), "utf8") };
    });

const wrappers = sources.filter((entry) => isPluginWrapper(entry.text));
const rules = sources.filter((entry) => !isPluginWrapper(entry.text) && isRule(entry.text));

const STYLELINT_DIR = absolutePath("govlabHost.stylelintRules");
const STYLELINT_PREFIX = relative(GENERATED_DIR, STYLELINT_DIR).split("\\").join("/");
const STYLELINT_SUFFIX = ".stylelint.rule.ts";
const STYLELINT_IDENTIFIER_TAIL = "Stylesheet";

const stylesheetRules = (existsSync(STYLELINT_DIR) ? readdirSync(STYLELINT_DIR) : [])
    .filter((name) => isRuleSource(name) && name.endsWith(STYLELINT_SUFFIX))
    .toSorted((a, b) => a.localeCompare(b))
    .map((name) => ({ label: name.slice(0, -STYLELINT_SUFFIX.length), stem: name.slice(0, -3) }));

const imports = [
    ...rules.map((r) => `import ${identifierOf(r.label)} from "${IMPORT_PREFIX}/${r.stem}.ts";`),
    ...wrappers.map((w) => `import ${identifierOf(w.label)}Plugin from "${IMPORT_PREFIX}/${w.stem}.ts";`),
].join("\n");
const stylesheetImports = stylesheetRules
    .map((s) => `import ${identifierOf(s.label)}${STYLELINT_IDENTIFIER_TAIL} from "${STYLELINT_PREFIX}/${s.stem}.ts";`)
    .join("\n");

const entries = rules.map((r) => `    "${r.label}": ${identifierOf(r.label)},`).join("\n");
const severities = rules.map((r) => `    "local/${r.label}": "${SEVERITY}",`).join("\n");
const pluginList = wrappers.map((w) => `    ${identifierOf(w.label)}Plugin,`).join("\n");
const stylesheetEntries = stylesheetRules
    .map((s) => `    "${s.label}": ${identifierOf(s.label)}${STYLELINT_IDENTIFIER_TAIL},`)
    .join("\n");
const stylesheetSeverities = stylesheetRules.map((s) => `    "local/${s.label}": true,`).join("\n");

const body = [
    HEADER,
    imports,
    "",
    "export const LOCAL_RULES: Record<string, unknown> = {",
    entries,
    "};",
    "",
    "export const LOCAL_SEVERITIES: Record<string, string> = {",
    severities,
    "};",
    "",
    "export const PLUGIN_MODULES: readonly unknown[] = [",
    pluginList,
    "];",
    "",
    "export const LOCAL_STYLELINT_SEVERITIES: Record<string, boolean> = {",
    stylesheetSeverities,
    "};",
    "",
].join("\n");

writeVerbatim(OUT, body);

const STYLELINT_OUT = join(GENERATED_DIR, "stylelint-index.generated.ts");

writeVerbatim(
    STYLELINT_OUT,
    [
        stylesheetImports,
        "",
        "export const LOCAL_STYLELINT_RULES: Record<string, unknown> = {",
        stylesheetEntries,
        "};",
        "",
    ].join("\n"),
);

const EXCLUSIONS_OUT = join(GENERATED_DIR, "exclusions.generated.ts");

const exclusionsSource = function exclusionsSource(values: readonly string[]): string {
    return [
        "export const MASTER_EXCLUDE_MARKERS: readonly string[] = [",
        ...values.map((marker) => `    ${JSON.stringify(marker)},`),
        "];",
        "",
    ].join("\n");
};

if (!existsSync(EXCLUSIONS_OUT)) {
    writeVerbatim(EXCLUSIONS_OUT, exclusionsSource([]));
}

const THRESHOLDS_OUT = join(GENERATED_DIR, "thresholds.generated.ts");
const FILE_LENGTH_CONCERN = "file-length";

const thresholdsSource = function thresholdsSource(fileLength: number): string {
    return [`export const FILE_LENGTH = ${String(fileLength)};`, ""].join("\n");
};

if (!existsSync(THRESHOLDS_OUT)) {
    writeVerbatim(THRESHOLDS_OUT, thresholdsSource(0));
}

const config = await loadGovlabConfig(ROOT);
const markers = masterExcludeMarkers(config);
writeVerbatim(EXCLUSIONS_OUT, exclusionsSource(markers));

const fileLength = config.qualityMaster?.concerns?.[FILE_LENGTH_CONCERN];
if (typeof fileLength !== "number") {
    throw new TypeError(budgetNotNumber(FILE_LENGTH_CONCERN));
}
writeVerbatim(THRESHOLDS_OUT, thresholdsSource(fileLength));

const TESTS_ROOT = `${absolutePath("codebase.testing")}${sep}`;
const SOURCE_SUFFIX = ".ts";

const declaredChecks = filesUnder(ROOT, pathExclusion(ROOT, markers))
    .filter((file) => file.endsWith(SOURCE_SUFFIX) && !file.startsWith(TESTS_ROOT))
    .flatMap((file) => {
        const text = readFileSync(file, "utf8");
        if (!text.includes(DECLARING_CALLEE)) {
            return [];
        }
        const check = relative(ROOT, file).split(sep).join("/");
        return declarationsIn(file, text).map((declaration) => {
            if (declaration === null) {
                throw new Error(unreadableDeclaration(check, DECLARING_CALLEE));
            }
            return { check, detects: declaration.detects, enforces: declaration.enforces };
        });
    })
    .toSorted((a, b) => a.check.localeCompare(b.check));
const CHECKS_OUT = absolutePath("govlabHost.checks");
writeVerbatim(CHECKS_OUT, `${JSON.stringify(declaredChecks, null, 4)}\n`);

process.stdout.write(indexedLine(rules.length, wrappers.length, relativePath("govlabHost.generated")));
process.stdout.write(stylesheetIndexedLine(stylesheetRules.length, STYLELINT_OUT));
process.stdout.write(markersLine(markers.length, EXCLUSIONS_OUT));
process.stdout.write(budgetLine(fileLength, THRESHOLDS_OUT));
process.stdout.write(checksLine(declaredChecks.length, CHECKS_OUT));
