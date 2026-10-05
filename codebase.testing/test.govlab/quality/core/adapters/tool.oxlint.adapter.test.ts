import { expect, test } from "vitest";
import {
    govlabOxlintConfig,
    govlabOxlintFixConfig,
    runOxlint,
} from "@govlab/quality/core/adapters/tool.oxlint.adapter.ts";
import { mkdtempSync, readFileSync } from "node:fs";
import { writeCanonicalJson, writeVerbatim } from "@govlab/canonical-write";
import { ROOT } from "@ssot/paths";
import type { RunnerContext } from "@govlab/quality/types/tool.types.ts";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

const REPORT_ONLY_RULE_ID = "unicorn/prefer-set-has";
const PLANTED_FILE = "span.ts";
const CONFIG_FILE = "oxlintrc.json";
const SUBSTRING_SEARCH = [
    'const COMPARISONS = ["!==", "===", "!=", "=="];',
    "",
    "export function comparedBetween(source: string, from: number, to: number): boolean {",
    "    const span = source.slice(from, to);",
    "    for (const operator of COMPARISONS) {",
    "        if (span.includes(operator)) return true;",
    "    }",
    "    return false;",
    "}",
    "",
].join("\n");

const oxlintBin = function oxlintBin(): string {
    return path.resolve(path.dirname(createRequire(import.meta.url).resolve("oxlint")), "..", "bin", "oxlint");
};

const fixedWith = async function fixedWith(config: Record<string, unknown>): Promise<string> {
    const dir = mkdtempSync(path.join(tmpdir(), "oxlint-fix-"));
    await writeCanonicalJson(path.join(dir, CONFIG_FILE), config);
    writeVerbatim(path.join(dir, PLANTED_FILE), SUBSTRING_SEARCH);
    spawnSync(process.execPath, [oxlintBin(), "-c", CONFIG_FILE, "--fix", PLANTED_FILE], { cwd: dir });
    return readFileSync(path.join(dir, PLANTED_FILE), "utf8");
};

test("runOxlint resolves to a run result even when the scan finds nothing to lint", async () => {
    const root = mkdtempSync(path.join(tmpdir(), "oxlint-runner-"));
    const context: RunnerContext = { ecosystem: "javascript", fix: false, languageId: "javascript", paths: [], root };
    const result = await runOxlint(context);
    expect(typeof result).toBe("object");
});

test("a report-only rule reports on the normal pass and is switched off only in the fix pass", async () => {
    const report = await govlabOxlintConfig(ROOT);
    const fix = await govlabOxlintFixConfig(ROOT);
    expect(JSON.stringify(report)).not.toContain(`"${REPORT_ONLY_RULE_ID}":"off"`);
    expect(JSON.stringify(fix)).toContain(`"${REPORT_ONLY_RULE_ID}":"off"`);
});

test("the report config rewrites a substring search into a Set, and the fix config leaves it intact", async () => {
    expect(await fixedWith(await govlabOxlintConfig(ROOT))).toContain("new Set(");
    expect(await fixedWith(await govlabOxlintFixConfig(ROOT))).toContain("span.includes(");
});
