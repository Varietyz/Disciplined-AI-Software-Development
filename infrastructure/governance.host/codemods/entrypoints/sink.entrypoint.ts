import { CODEMOD_TSCONFIGS, programFor, repoSourceFiles } from "../selectors/program.selector.ts";
import type { WriteFinding, WriteScope } from "../../types/analyzer.types.ts";
import { dirname, join } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import type { Edit } from "../../types/codemod.types.ts";
import { ROOT } from "@ssot/paths";
import { applyCodemod } from "../selectors/codemod.selector.ts";
import { defineCheck } from "@govlab/context/check";
import { loadGovlabConfig } from "@govlab/quality/config";
import { scanSourceFile } from "../analyzers/sink.analyzer.ts";

const RULE_ID = "no-raw-file-write";
const RULE_KEY = "govlab-write/no-raw-file-write";
const WRITER_MODULE = "@govlab/canonical-write";
const MANIFEST = "package.json";

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const ownerModulesOf = function ownerModulesOf(rules: unknown): Set<string> {
    const entry = isRecord(rules) ? rules[RULE_KEY] : undefined;
    const options: unknown = Array.isArray(entry) ? entry.at(1) : undefined;
    const modules = isRecord(options) ? options["modules"] : undefined;
    return new Set(Array.isArray(modules) ? modules.filter((name): name is string => typeof name === "string") : []);
};

const nearestManifest = function nearestManifest(fileName: string): string | null {
    let folder = dirname(fileName);
    while (folder !== dirname(folder)) {
        const candidate = join(folder, MANIFEST);
        if (existsSync(candidate)) {
            return candidate;
        }
        folder = dirname(folder);
    }
    return null;
};

const declaresWriter = function declaresWriter(fileName: string): boolean {
    const manifest = nearestManifest(fileName);
    if (manifest === null) {
        return false;
    }
    const parsed: unknown = JSON.parse(readFileSync(manifest, "utf8"));
    const dependencies = isRecord(parsed) ? parsed["dependencies"] : undefined;
    return isRecord(dependencies) && WRITER_MODULE in dependencies;
};

const qualityConfig = await loadGovlabConfig(ROOT);
const writeScope: WriteScope = { declaresWriter, owners: ownerModulesOf(qualityConfig.eslint?.rules) };

const collect = function collect(): WriteFinding[] {
    const seen = new Set<string>();
    return CODEMOD_TSCONFIGS.flatMap((tsconfig) => {
        const program = programFor(tsconfig);
        const checker = program.getTypeChecker();
        return repoSourceFiles(program).flatMap((source) => scanSourceFile(checker, source, writeScope));
    }).filter((finding) => {
        const key = `${finding.file}:${String(finding.start)}`;
        const fresh = !seen.has(key);
        seen.add(key);
        return fresh;
    });
};

const buildEdits = function buildEdits(findings: readonly WriteFinding[]): Map<string, Edit[]> {
    const byFile = new Map<string, Edit[]>();
    for (const finding of findings) {
        const known = byFile.get(finding.fileName);
        const imports = known === undefined ? finding.importEdits : [];
        const edit: Edit = { end: finding.end, replacement: finding.replacement, start: finding.start };
        byFile.set(finding.fileName, [...(known ?? []), ...imports, edit]);
    }
    return byFile;
};

applyCodemod({
    appliedNoun: "raw file write(s) routed through the owner's verbatim writer",
    blockedMessage: (finding) =>
        `A raw file write outside the module that owns file writes skips what the owner guarantees. This write cannot be rewritten automatically (${finding.reason ?? ""}).`,
    checks: defineCheck({ detects: [], enforces: ["architecture:idempotency", "architecture:determinism"] }),
    editsByFile: buildEdits,
    findings: collect(),
    gateOnBlocked: false,
    label: (finding) => finding.replacement,
    programCount: CODEMOD_TSCONFIGS.length,
    ruleId: RULE_ID,
});
