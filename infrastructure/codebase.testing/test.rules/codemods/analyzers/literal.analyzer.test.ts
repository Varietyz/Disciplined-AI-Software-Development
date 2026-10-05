import { collectLiteralFindings, literalFindingsIn } from "@ssot/govlab/codemods/analyzers/literal.analyzer.ts";
import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const PAIRS = [{ from: '"ai_governance"', to: '"model_governance"' }];
const MATCHING = '{"force": ["ai_governance"]}';

describe("literalFindingsIn", () => {
    it("finds every exact occurrence with its line", () => {
        const content = '{\n  "force": ["ai_governance"],\n  "scope": ["ai_governance"]\n}';
        const findings = literalFindingsIn("probe.json", content, PAIRS);
        expect(findings.map((finding) => finding.line)).toEqual([2, 3]);
        expect(findings.every((finding) => finding.reason === null)).toBe(true);
    });

    it("matches only the exact text, not a longer token that contains it", () => {
        const content = '{"force": ["ai_governance_extra"]}';
        expect(literalFindingsIn("probe.json", content, PAIRS)).toEqual([]);
    });

    it("blocks every match in a JSON file whose rewrite would not parse", () => {
        const findings = literalFindingsIn("probe.json", '{"a": 1}', [{ from: "1", to: "1," }]);
        expect(findings).toHaveLength(1);
        expect(findings[0]?.reason).toContain("unparsable as JSON");
    });

    it("does not parse-check a file that is not JSON", () => {
        const findings = literalFindingsIn("probe.md", "a { b", [{ from: "b", to: "}" }]);
        expect(findings[0]?.reason).toBeNull();
    });
});

describe("collectLiteralFindings", () => {
    it("walks a root, skips every path the master exclusion list names, and keeps only the wanted extensions", () => {
        const root = mkdtempSync(join(tmpdir(), "codemod-literal-"));
        try {
            mkdirSync(join(root, "node_modules"));
            writeVerbatim(join(root, "kept.json"), MATCHING);
            writeVerbatim(join(root, "kept.md"), MATCHING);
            writeVerbatim(join(root, "probe.generated.json"), MATCHING);
            writeVerbatim(join(root, "node_modules", "dependency.json"), MATCHING);
            const everyFile = collectLiteralFindings([root], PAIRS, []);
            expect(everyFile.map((finding) => finding.fileName).toSorted()).toStrictEqual([
                join(root, "kept.json"),
                join(root, "kept.md"),
            ]);
            const jsonOnly = collectLiteralFindings([root], PAIRS, [".json"]);
            expect(jsonOnly.map((finding) => finding.fileName)).toStrictEqual([join(root, "kept.json")]);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
