import {
    aliasCollides,
    answerShapeMismatch,
    collidingCell,
    conditionalSeverityNeeded,
    danglingConcept,
    danglingEdgeSource,
    danglingReasonField,
    danglingTransition,
    duplicateReasonId,
    emptyReasonField,
    nonCanonicalKind,
    repairWrongKind,
    scopeNotLayer,
    siblingsUnder,
    unresolvedModelStep,
} from "@govlab/context/configuration/strings/validation.strings.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("every reasoning defect line names the record and the value that does not resolve", () => {
    assert.equal(duplicateReasonId("node:n1"), "duplicate id node:n1");
    assert.equal(danglingConcept("n1", "ghost"), "node n1 → concept ghost");
    assert.ok(
        danglingReasonField({ field: "axis", id: "n1", kind: "node", target: "reasoning:axis", value: "aX" }).endsWith(
            "is not a reasoning:axis record",
        ),
    );
    assert.ok(emptyReasonField({ field: "fit", id: "s", kind: "test-surface" }).includes("fit is empty"));
    assert.ok(danglingTransition({ from: "s1", reason: "to is not a stage", to: "sZ" }).includes("s1→sZ"));
    assert.equal(danglingEdgeSource("ghost"), "edge source ghost");
    assert.ok(collidingCell("meaning::semantic", ["a", "b"]).endsWith("a, b"));
    assert.ok(answerShapeMismatch({ allowed: "boolean", answerShape: "ranking", node: "n1" }).includes("ranking"));
    assert.ok(unresolvedModelStep({ model: "m", step: "s", stepKind: "mode" }).endsWith("not a mode record"));
});

test("the architecture defect lines name the scope, the kind, the level or the key", () => {
    assert.ok(scopeNotLayer("runtime", "domain").includes("runtime/domain"));
    assert.ok(nonCanonicalKind("widget").includes('"widget"'));
    assert.ok(conditionalSeverityNeeded("contextual").includes('"contextual"'));
    assert.equal(siblingsUnder("architecture:parent requires"), "siblings under architecture:parent requires");
});

test("an alias collision line names every record that holds the same key", () => {
    assert.ok(aliasCollides(["architecture:a", "lexicon:b"]).includes("architecture:a, lexicon:b"));
});

test("a repair kind line names the kind found and every kind the field admits", () => {
    assert.equal(
        repairWrongKind("metric", ["technique", "pattern"]),
        "names a metric, where the field admits technique, pattern",
    );
});
