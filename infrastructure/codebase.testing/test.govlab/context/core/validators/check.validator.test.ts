import { checkDeclarationDefectsOf, declaringChecksOf } from "@govlab/context/core/validators/check.validator.ts";
import { plantedFaces, plantedPrinciple } from "./ontology.fixture.ts";
import { ARCH_FACE } from "@govlab/constants";
import assert from "node:assert/strict";
import { checkedRecordsOf } from "@govlab/context/core/selectors/check.selector.ts";
import { defineCheck } from "@govlab/context/check";
import { test } from "vitest";

const PRINCIPLE = "planted-principle";
const ANTI_PATTERN = "planted-anti-pattern";

const faces = plantedFaces(
    [plantedPrinciple(PRINCIPLE), plantedPrinciple(ANTI_PATTERN, { severity: "mandatory", type: "anti-pattern" })],
    [],
);

const refOf = function refOf(id: string): string {
    return `${ARCH_FACE}:${id}`;
};

test("a declaration whose refs resolve to records of the right kind carries no defect", () => {
    const declaration = defineCheck({ detects: [refOf(ANTI_PATTERN)], enforces: [refOf(PRINCIPLE)] });
    assert.deepEqual(checkDeclarationDefectsOf(faces, [{ check: "probe.ts", ...declaration }]), []);
});

test("a ref of the wrong kind and a ref that resolves to nothing are both defects", () => {
    const checks = [{ check: "probe.ts", detects: [refOf(PRINCIPLE)], enforces: [refOf("no-such-record")] }];
    assert.deepEqual(checkDeclarationDefectsOf(faces, checks), [
        { check: "probe.ts", field: "detects", ref: refOf(PRINCIPLE), resolved: true },
        { check: "probe.ts", field: "enforces", ref: refOf("no-such-record"), resolved: false },
    ]);
});

test("a declaring check counts as a check of the record it names", () => {
    const checks = [{ check: "probe.ts", detects: [], enforces: [refOf(PRINCIPLE)] }];
    assert.deepEqual(declaringChecksOf(checks).get(refOf(PRINCIPLE)), ["probe.ts"]);
    const record = checkedRecordsOf(faces, checks).find((entry) => entry.id === PRINCIPLE);
    assert.equal(record?.by.includes("probe.ts"), true);
});
