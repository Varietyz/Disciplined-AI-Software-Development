import {
    aliasLine,
    ambiguousLine,
    blockHeading,
    checkRefLine,
    collisionLine,
    deadSeedLine,
    declarationLine,
    distinctLine,
    edgeLabelLine,
    expressionLine,
    failedItem,
    fieldLine,
    groundLine,
    kindConflictLine,
    lensLine,
    lexDefectLine,
    listedItem,
    misspelledLine,
    moreItems,
    pairLine,
    reasonEdgeLine,
    reasonedLine,
    relationLine,
    repairLine,
    shapeInstanceLine,
    tensionLine,
    uncheckedLine,
    ungroundedGateLine,
    unknownKeyLine,
    unreachableLine,
} from "@govlab/context/configuration/strings/validation.report.strings.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("the item marks tell a failed item from a listed one, and a heading opens on its own line", () => {
    assert.equal(failedItem("x"), "  ✖ x");
    assert.equal(listedItem("x"), "  · x");
    assert.equal(blockHeading("h"), "\n  h");
    assert.ok(moreItems(3).includes("3 more"));
});

test("every worklist line names the record and the value it reports", () => {
    const lines: [string, string][] = [
        [lexDefectLine("t", "a reason"), "t"],
        [collisionLine("shared"), "shared"],
        [kindConflictLine("r", "principle", "a defect in which", "anti-pattern"), "anti-pattern"],
        [unreachableLine("lonely"), "lonely"],
        [reasonedLine("r", "a reason"), "a reason"],
        [tensionLine("a", "b", "a reason"), '"b"'],
        [misspelledLine("r", "object creation", "object_creation"), "object_creation"],
        [deadSeedLine("a", "b", "a reason"), '"a"'],
        [ungroundedGateLine("foo-gate"), "foo-gate"],
        [fieldLine("architecture", "r", "definition"), "definition"],
        [expressionLine("r", "pag:x"), '"pag:x"'],
        [pairLine("principle", "a", "b", "requires"), "(requires)"],
        [distinctLine("a", "b", "a reason"), '"b"'],
        [aliasLine("architecture:a", "AB", "a reason"), 'architecture:a alias "AB"'],
        [repairLine("architecture:a", "violated_by", "lexicon:b", "a reason"), 'violated_by "lexicon:b"'],
        [repairLine("architecture:a", "formed_by", "", "a reason"), "architecture:a formed_by — a reason"],
        [shapeInstanceLine("s", "algorithms:ghost"), '"algorithms:ghost"'],
        [ambiguousLine("c1", "reasoning:invariant", ["lens", "node"]), "lens, node"],
        [edgeLabelLine("x", "claims-need-evidence"), '"claims-need-evidence"'],
        [checkRefLine("architecture", "r", "by", "architecture:ghost"), '"architecture:ghost"'],
        [uncheckedLine("architecture", "r", ["by", "evidence"]), "by, evidence"],
        [unknownKeyLine("architecture", "file/r", "stray", "unread"), '"stray"'],
        [reasonEdgeLine("algorithms:nope"), '"algorithms:nope"'],
        [lensLine("sequential", "algorithms:ghost"), '"algorithms:ghost"'],
        [groundLine("c1", "reasoning:nope"), '"reasoning:nope"'],
        [relationLine("a", "requires", "b", "metric", ["principle"]), "{principle}"],
    ];
    for (const [line, part] of lines) {
        assert.ok(line.includes(part), line);
    }
});

test("a check declaration line tells a ref that names no record from one that names the wrong kind", () => {
    assert.ok(declarationLine("rule", "enforces", "architecture:ghost", false).endsWith("names no record"));
    assert.ok(declarationLine("rule", "detects", "architecture:x", true).endsWith("names a record of the wrong kind"));
});
