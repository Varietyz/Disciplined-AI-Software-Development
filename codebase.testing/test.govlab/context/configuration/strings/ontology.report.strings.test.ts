import {
    archEdgesRow,
    candidateLine,
    commandOf,
    composesLine,
    coverageCell,
    coverageRow,
    defectRow,
    divergentLine,
    documentRow,
    documentsTotal,
    lexiconTermsRow,
    moreTargets,
    nativeBacklogRow,
    nativeRow,
    nativeSubtotalRow,
    pagBnfRow,
    pagFailed,
    pagRecognitionRow,
    pagTemplateRow,
    remediationLines,
    resolutionFailed,
    summaryRow,
    symbolStalenessRow,
    symbolsGenerated,
    targetLine,
    targetTrail,
    totalRow,
    unreachedRow,
} from "@govlab/context/configuration/strings/ontology.report.strings.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("a summary row adds its note in brackets only when it has one", () => {
    assert.ok(summaryRow("rows:", 2, "a note").endsWith("2  (a note)"));
    assert.ok(summaryRow("rows:", 2, "").endsWith("2"));
    assert.ok(lexiconTermsRow(7).endsWith("7"));
    assert.ok(archEdgesRow(3, 2).includes("2 distinct targets"));
});

test("the grammar rows carry each count they are handed", () => {
    assert.ok(pagTemplateRow([1, 2, 3, 4]).includes("4 unknown-template-type"));
    assert.ok(pagRecognitionRow(1, 2).includes("2 verb(s)"));
    assert.ok(pagBnfRow(1, 2).includes("2 unused terminal(s)"));
});

test("a coverage cell marks declared absences in brackets only when there are some", () => {
    assert.equal(coverageCell("by", 3, 1), "by 3[1]");
    assert.equal(coverageCell("by", 3, 0), "by 3");
    assert.equal(coverageRow("architecture", 5, "by 3"), "  architecture (5): by 3");
    assert.ok(unreachedRow(4).includes("4"));
});

test("the native rows carry their counts, the staleness and the total", () => {
    assert.ok(nativeBacklogRow(1, 2).includes("2 unstaged"));
    assert.ok(nativeRow("label:", 3, "a note").endsWith("3  (a note)"));
    assert.ok(symbolStalenessRow(true, 1, 2).includes("STALE"));
    assert.ok(symbolStalenessRow(false, 2, 2).includes("current"));
    assert.ok(nativeSubtotalRow(5).includes("5"));
    assert.ok(totalRow(9).endsWith("9"));
});

test("the target lines name the target, its sites and the fixes", () => {
    assert.ok(targetLine("Speed", 2, "").includes('"Speed"'));
    assert.equal(targetTrail(["a.requires"], true), "  [a.requires, …]");
    assert.equal(targetTrail(["a.requires"], false), "  [a.requires]");
    assert.ok(remediationLines("Speed", "speed", "lexicon/").some((line) => line.includes('"speed"')));
    assert.ok(moreTargets(3).includes("3 more"));
    assert.ok(composesLine("a", "ghost").includes('"ghost"'));
    assert.ok(divergentLine("g", "Delta", ["r1", "r2"]).includes("r1, r2"));
    assert.equal(candidateLine("a", "b"), "a ↔ b");
});

test("the run lines name the command, the documents and the totals", () => {
    assert.equal(commandOf("entry.ts"), "node entry.ts");
    assert.ok(resolutionFailed(2).includes("2"));
    assert.ok(documentRow(true, "agent.md", 0).includes("✓"));
    assert.ok(documentRow(false, "agent.md", 1).includes("✖"));
    assert.ok(defectRow("agent.md", 3, "result_missing", "1").includes("agent.md:3"));
    assert.ok(documentsTotal(4, 0).includes("documents: 4"));
    assert.ok(pagFailed(1).includes("1"));
    assert.ok(symbolsGenerated(10, 2).includes("2 grammars"));
});
