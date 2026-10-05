import { describe, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { shapeFindings, sourceFindings } from "coordination-surface/tools/core/validators/rule.validator.ts";
import { GENERATED_DIR } from "coordination-surface/tools/core/constants/path.constants.ts";
import { REPORT_SUFFIX } from "coordination-surface/tools/core/constants/report.constants.ts";
import assert from "node:assert/strict";
import { join } from "node:path";
import { loadTaxonomy } from "coordination-surface/tools/core/resolvers/taxonomy.resolver.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

type Context = Parameters<typeof shapeFindings>[0];

const RULE_PATH = "tools/rules/probe.rule.ts";

const DECLARED = [
    "export const rule = {",
    '    stage: "content",',
    '    jurisdiction: "all",',
    '    invariant: "",',
    "    extensions: [],",
    "    kinds: [],",
    "    heals: false,",
    "    check(context) { return context.paths; },",
    "};",
].join("\n");

const lociOf = function lociOf(findings: readonly { readonly locus: string }[]): string[] {
    return findings.map((finding) => finding.locus);
};

describe("sourceFindings", () => {
    it("reports a rule source with no export, one that matches by regular expression, and each gap in a declaration", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-rule-"));
        try {
            mkdirSync(join(root, GENERATED_DIR), { recursive: true });
            assert.deepEqual(lociOf(sourceFindings(root, RULE_PATH, "const quiet = 1;")), ["export"]);
            assert.deepEqual(lociOf(sourceFindings(root, RULE_PATH, "const pattern = new RegExp(text);")), [
                "matching",
                "export",
            ]);
            assert.deepEqual(lociOf(sourceFindings(root, RULE_PATH, DECLARED)), ["probe"]);
            writeVerbatim(
                join(root, GENERATED_DIR, `probe${REPORT_SUFFIX}`),
                JSON.stringify({ authoritative: true, scope: "all" }),
            );
            assert.deepEqual(lociOf(sourceFindings(root, RULE_PATH, DECLARED)), ["probe.report.verdict"]);
            const stageless = DECLARED.replace('stage: "content"', "phase: 1");
            assert.deepEqual(lociOf(sourceFindings(root, RULE_PATH, stageless)), [
                "stage",
                "probe.report.verdict",
                "stage",
            ]);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});

describe("shapeFindings", () => {
    it("reports each finding field an emitting source leaves out", () => {
        const context: Context = {
            exists: () => true,
            id: "governance",
            paths: ["a.ts"],
            read: () => "findings.push({ rule, path, locus, stack, actual, expected, remediation });",
            repoRoot: "",
            taxonomy: loadTaxonomy(),
        };
        assert.deepEqual(lociOf(shapeFindings(context)), ["finding.healed"]);
    });
});
