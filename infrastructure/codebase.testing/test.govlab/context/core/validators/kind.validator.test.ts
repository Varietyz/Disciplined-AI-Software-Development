import {
    buildKindLookup,
    lexKindIssues,
    relationKindViolationsOf,
} from "@govlab/context/core/validators/kind.validator.ts";
import { plantedFaces, plantedPrinciple } from "./ontology.fixture.ts";
import assert from "node:assert/strict";
import { createLexicon } from "@govlab/context";
import { test } from "vitest";

const TERMS = [
    {
        category: "planted",
        records: [
            { definition: "The degree to which work is fast.", kind: "quality-attribute", name: "Speed" },
            { definition: "", kind: "gadget", name: "Odd Term" },
        ],
    },
];

test("buildKindLookup reads the kind of a principle or a term by any of its names", () => {
    const faces = plantedFaces([plantedPrinciple("planted-rule")], TERMS);
    const kindOf = buildKindLookup(faces);
    assert.equal(kindOf("planted-rule"), "principle");
    assert.equal(kindOf("Speed"), "quality-attribute");
    assert.equal(kindOf("nothing"), null);
});

test("an edge to a target whose kind the relation does not admit is a violation", () => {
    const faces = plantedFaces(
        [plantedPrinciple("planted-rule", { conflicts_with: ["Speed"], enables: ["Speed"] })],
        TERMS,
    );
    const violations = relationKindViolationsOf(faces.arch, buildKindLookup(faces));
    assert.deepEqual(
        violations.map((entry) => [entry.from, entry.relation, entry.kind]),
        [["planted-rule", "conflicts_with", "quality-attribute"]],
    );
});

test("a term of an unknown kind or with no definition is a defect", () => {
    const faces = plantedFaces([], []);
    const issues = lexKindIssues(createLexicon({ data: TERMS }), faces.arch);
    assert.deepEqual(
        issues.lexDefects.map((defect) => defect.id),
        ["odd-term", "odd-term"],
    );
});
