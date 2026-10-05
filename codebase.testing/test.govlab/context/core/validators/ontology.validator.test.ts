import { ARCH_FACE, LEX_FACE } from "@govlab/constants";
import { PLANTED_GATE, PLANTED_ID, plantedFaces, plantedPrinciple } from "./ontology.fixture.ts";
import { checkGapsFor, runValidation } from "@govlab/context/core/validators/ontology.validator.ts";
import type { TermCategory } from "@govlab/context/types/lexicon.types.ts";
import assert from "node:assert/strict";
import { createGovlabContext } from "@govlab/context";
import { test } from "vitest";

const ANSWERED_CHECK = {
    freshness: "a verdict stands until the planted module changes",
    observation: "none: the planted rule is decided on source",
    population: "every planted module",
    refusal: "the planted gate fails the lint run",
};

const archGapsWith = (check: object): { collection: string; id: string; missing: string[] }[] =>
    checkGapsFor(
        plantedFaces([plantedPrinciple(PLANTED_ID, { check, enforced_by: PLANTED_GATE })], []),
    ).uncheckedRecords.filter((entry) => entry.collection === ARCH_FACE);

test("every bundled record has a reachable check and every check ref resolves", () => {
    const context = createGovlabContext();
    const gaps = context.checkGaps();
    assert.deepEqual(gaps.uncheckedRecords, []);
    assert.deepEqual(gaps.unresolvedCheckRefs, []);
    assert.deepEqual(gaps.secondCheckHomes, []);
    assert.deepEqual(gaps.uncoveredCollections, []);
    const arch = gaps.collections.find((coverage) => coverage.collection === ARCH_FACE);
    assert.equal(arch?.records, context.arch.all().length);
});

test("a principle with no enforcing check and no facet is reported unchecked", () => {
    const gaps = checkGapsFor(plantedFaces([plantedPrinciple(PLANTED_ID)], []));
    assert.deepEqual(
        gaps.uncheckedRecords.filter((entry) => entry.collection === ARCH_FACE),
        [
            {
                collection: ARCH_FACE,
                id: PLANTED_ID,
                missing: ["by", "population", "freshness", "refusal", "observation", "evidence", "authority"],
            },
        ],
    );
});

test("an evidence answer with no known sign, or with nothing after its sign, is reported, and so is a missing authority", () => {
    assert.deepEqual(archGapsWith({ ...ANSWERED_CHECK, evidence: "probably: it looked fine" }), [
        { collection: ARCH_FACE, id: PLANTED_ID, missing: ["evidence", "authority"] },
    ]);
    assert.deepEqual(archGapsWith({ ...ANSWERED_CHECK, authority: "the declared rule", evidence: "fires:" }), [
        { collection: ARCH_FACE, id: PLANTED_ID, missing: ["evidence"] },
    ]);
    for (const evidence of [
        "fires: a planted violation",
        "fires-and-accepts: a planted violation and a conforming case",
        "contradicted: a planted violation the gate passed",
        "none: nothing has watched the planted gate",
    ]) {
        assert.deepEqual(archGapsWith({ ...ANSWERED_CHECK, authority: "the declared rule", evidence }), [], evidence);
    }
});

test("a term takes its check from the edges that name it and is reported when none does", () => {
    const terms: TermCategory[] = [
        {
            category: "planted",
            records: [
                { definition: "A rule or precondition named by an edge.", kind: "constraint", name: "Named Term" },
                { definition: "A rule or precondition nothing names.", kind: "constraint", name: "Orphan Term" },
            ],
        },
    ];
    const gaps = checkGapsFor(
        plantedFaces([plantedPrinciple(PLANTED_ID, { enforced_by: PLANTED_GATE, requires: ["Named Term"] })], terms),
    );
    const lexicon = gaps.uncheckedRecords.filter((entry) => entry.collection === LEX_FACE);
    assert.deepEqual(lexicon, [{ collection: LEX_FACE, id: "orphan-term", missing: ["by"] }]);
    assert.deepEqual(gaps.unresolvedCheckRefs, []);
});

test("a check or dependency ref that resolves to no record is reported, and a second check home too", () => {
    const terms: TermCategory[] = [
        {
            category: "planted",
            records: [
                {
                    definition: "A rule or precondition with a dangling dependency.",
                    kind: "constraint",
                    name: "Named Term",
                    seeAlso: ["ghost-term"],
                },
            ],
        },
    ];
    const principle = plantedPrinciple(PLANTED_ID, {
        check: { by: ["a second home"] },
        enforced_by: ["architecture:ghost-rule"],
        requires: ["Named Term"],
    });
    const gaps = checkGapsFor(plantedFaces([principle], terms));
    assert.deepEqual(gaps.unresolvedCheckRefs, [
        { collection: ARCH_FACE, field: "by", id: PLANTED_ID, ref: "architecture:ghost-rule" },
        { collection: LEX_FACE, field: "dependsOn", id: "named-term", ref: "lexicon:ghost-term" },
    ]);
    assert.deepEqual(gaps.secondCheckHomes, [{ collection: ARCH_FACE, home: "check.by", id: PLANTED_ID }]);
});

test("a severity outside the closed levels fails at load, and mandatoryFor beside any level but contextual is reported", () => {
    assert.throws(
        () => plantedFaces([plantedPrinciple("loud-rule", { severity: "high" })], []),
        (error: unknown) => error instanceof Error && error.message.includes('declares "high"'),
    );
    const issues = runValidation(
        plantedFaces([plantedPrinciple("gated-rule", { mandatoryFor: "production", severity: "mandatory" })], []),
    );
    assert.deepEqual(
        issues.invalidSeverities.map((entry) => entry.id),
        ["gated-rule"],
    );
});

test("a required field left blank is reported, and none with a reason passes", () => {
    const issues = runValidation(
        plantedFaces(
            [
                plantedPrinciple("blank-rule", { definition: "", enforced_by: PLANTED_GATE }),
                plantedPrinciple("absent-rule", {
                    enforced_by: PLANTED_GATE,
                    measured_by: ["none: nothing is counted"],
                }),
            ],
            [],
        ),
    );
    const planted = issues.emptyRequiredFields.filter((entry) => entry.collection === ARCH_FACE);
    assert.deepEqual(planted, [{ collection: ARCH_FACE, field: "definition", id: "blank-rule" }]);
});

test("a principle whose definition opens as another kind is reported", () => {
    const issues = runValidation(
        plantedFaces([plantedPrinciple("mixed-rule", { definition: "A defect in which the rule is planted." })], []),
    );
    assert.deepEqual(issues.kindConsistencyViolations, [
        { declaredKind: "principle", id: "mixed-rule", opening: "a defect in which", signalsKind: "anti-pattern" },
    ]);
});

test("a tension between two principles no layer places is unresolved, and the bundled tensions resolve", () => {
    const bundledIssues = createGovlabContext().validateResolution();
    assert.deepEqual(bundledIssues.unresolvedTensions, []);
    assert.deepEqual(bundledIssues.deadResolutionSeeds, []);
    const issues = runValidation(
        plantedFaces(
            [
                plantedPrinciple("speed-rule", { enforced_by: PLANTED_GATE, tensions_with: ["care-rule"] }),
                plantedPrinciple("care-rule", { enforced_by: PLANTED_GATE }),
            ],
            [],
        ),
    );
    assert.deepEqual(
        issues.unresolvedTensions.map((gap) => [gap.from, gap.target]),
        [["speed-rule", "care-rule"]],
    );
});
