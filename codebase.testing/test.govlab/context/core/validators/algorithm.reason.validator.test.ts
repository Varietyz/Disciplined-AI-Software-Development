import type { Contract, DomainTier } from "@govlab/context/types/algorithm.types.ts";
import { DOMAIN_TIER_VALUES } from "@govlab/context/configuration/constants/algorithm.constants.ts";
import { asClosed } from "@govlab/context/core/normalizers/field.normalizer.ts";
import assert from "node:assert/strict";
import { createGovlabContext } from "@govlab/context";
import { reasonNativeIssuesOf } from "@govlab/context/core/validators/algorithm.reason.validator.ts";
import { test } from "vitest";

interface FakeOver {
    algo?: readonly Contract[];
    algoIds?: Set<string>;
    axes?: Set<string>;
    mathTypes?: Record<string, { yieldsShape: string }>;
    stages?: { axis: string; id: string }[];
}

const FIXTURE_TIERS: Readonly<Record<string, DomainTier>> = {
    "Architectural Clusters": "exempt",
    architecture: "leaf",
    pag: "process",
};

const makeContract = (over: Partial<Contract>): Contract => ({
    composes: [],
    domain: "",
    flow: [],
    force: [],
    id: "",
    intent: "",
    invariant: "",
    productions: [],
    tier: FIXTURE_TIERS[over.domain ?? ""] ?? "exempt",
    title: "",
    ...over,
});

const fakeFaces = (over: FakeOver): Parameters<typeof reasonNativeIssuesOf>[0] => ({
    algo: {
        all: () => over.algo ?? [],
        get: (id: string) => ((over.algoIds ?? new Set<string>()).has(id) ? { id } : null),
    },
    reason: {
        axis: (id: string) => ((over.axes ?? new Set<string>()).has(id) ? { id } : null),
        derivationLoop: () => ({ stages: over.stages ?? [] }),
        mathType: (id: string) => over.mathTypes?.[id] ?? null,
    },
});

const REASON_VOCAB = {
    axes: new Set(["evaluative", "substrate"]),
    mathTypes: { logic: { yieldsShape: "boolean" }, optimization: { yieldsShape: "boolean | ranking" } },
    stages: [
        { axis: "evaluative", id: "verify" },
        { axis: "substrate", id: "constrain" },
    ],
};

const VALID_PROCESS = {
    axis: "evaluative",
    domain: "pag",
    id: "ok",
    mathType: "logic",
    stage: "verify",
    yields: "boolean",
};

const LOOP_GROUNDED = {
    derivationMap: [{ record: "r", stage: "verify" }],
    domain: "pag",
    grounds: ["reasoning:derivation-loop"],
    mathType: "logic",
    yields: "boolean",
};

const reasonNativeOf = (
    contracts: Partial<Contract>[],
    extra: Partial<FakeOver> = {},
): ReturnType<typeof reasonNativeIssuesOf> =>
    reasonNativeIssuesOf(fakeFaces({ ...REASON_VOCAB, algo: contracts.map(makeContract), ...extra }));

const withRecord = { algoIds: new Set(["r"]) };

test("reasonNativeIssuesOf reports a stage that is not a loop stage", () => {
    const issues = reasonNativeOf([{ domain: "pag", id: "c1", stage: "ghost" }]);
    assert.deepEqual(issues.invalidStages, [{ id: "c1", stage: "ghost" }]);
    assert.ok(issues.subtotal > 0);
});

test("reasonNativeIssuesOf passes a fully typed staged process record", () => {
    const issues = reasonNativeOf([VALID_PROCESS]);
    assert.deepEqual(issues.invalidStages, []);
    assert.equal(issues.subtotal, 0);
});

test("reasonNativeIssuesOf reports an axis that resolves to no reason axis", () => {
    const issues = reasonNativeOf([{ axis: "nope", domain: "pag", id: "c1" }]);
    assert.deepEqual(issues.invalidAxes, [{ axis: "nope", id: "c1" }]);
});

test("reasonNativeIssuesOf reports a mathType that resolves to nothing", () => {
    const issues = reasonNativeOf([{ domain: "pag", id: "c1", mathType: "nope" }]);
    assert.deepEqual(issues.invalidMathTypes, [{ id: "c1", mathType: "nope" }]);
});

test("reasonNativeIssuesOf reports an axis that is not the stage's axis", () => {
    const issues = reasonNativeOf([{ axis: "substrate", domain: "pag", id: "c1", stage: "verify" }]);
    assert.deepEqual(issues.stageAxisMismatches, [
        { axis: "substrate", expected: "evaluative", id: "c1", stage: "verify" },
    ]);
});

test("reasonNativeIssuesOf reports yields carrying a token outside the shape", () => {
    const issues = reasonNativeOf([{ domain: "pag", id: "c1", mathType: "logic", yields: "boolean | bogus" }]);
    assert.deepEqual(issues.yieldsShapeMismatches, [
        { allowed: "boolean", id: "c1", mathType: "logic", yields: "boolean | bogus" },
    ]);
});

test("reasonNativeIssuesOf passes yields that is a subset of a multi-token shape", () => {
    const issues = reasonNativeOf([
        { axis: "evaluative", domain: "pag", id: "c1", mathType: "optimization", stage: "verify", yields: "ranking" },
    ]);
    assert.deepEqual(issues.yieldsShapeMismatches, []);
    assert.equal(issues.subtotal, 0);
});

test("reasonNativeIssuesOf reports each derivation map defect with its reason", () => {
    const ghostStage = reasonNativeOf(
        [{ derivationMap: [{ record: "r", stage: "ghost" }], domain: "pag", id: "c1" }],
        withRecord,
    );
    assert.ok(ghostStage.derivationMapDefects[0]?.reason.includes("is not a derivation-loop stage") === true);
    const missing = reasonNativeOf([
        { derivationMap: [{ record: "missing", stage: "verify" }], domain: "pag", id: "c1" },
    ]);
    assert.ok(missing.derivationMapDefects[0]?.reason.includes("resolves to no algo contract") === true);
    const noVerify = reasonNativeOf(
        [{ derivationMap: [{ record: "r", stage: "constrain" }], domain: "pag", id: "c1" }],
        withRecord,
    );
    assert.ok(noVerify.derivationMapDefects[0]?.reason.includes("omits mandatory-always stage(s): verify") === true);
    const selfMap = reasonNativeOf([{ derivationMap: [{ record: "c1", stage: "verify" }], domain: "pag", id: "c1" }]);
    assert.ok(selfMap.derivationMapDefects[0]?.reason.includes("maps to the contract itself") === true);
});

test("reasonNativeIssuesOf passes a derivation map covering verify with resolving records", () => {
    const issues = reasonNativeOf(
        [
            {
                derivationMap: [{ record: "r", stage: "verify" }],
                domain: "pag",
                id: "c1",
                mathType: "logic",
                yields: "boolean",
            },
        ],
        withRecord,
    );
    assert.deepEqual(issues.derivationMapDefects, []);
});

test("reasonNativeIssuesOf reports a grammar that grounds the derivation loop twice", () => {
    const issues = reasonNativeOf(
        [
            { ...LOOP_GROUNDED, id: "k1" },
            { ...LOOP_GROUNDED, id: "k2" },
        ],
        withRecord,
    );
    assert.deepEqual(issues.duplicateLoopGroundings, [{ domain: "pag", records: ["k1", "k2"] }]);
    assert.equal(issues.subtotal, 1);
});

test("reasonNativeIssuesOf passes a single non-meta derivation loop grounding", () => {
    const issues = reasonNativeOf([{ ...LOOP_GROUNDED, id: "k1" }], withRecord);
    assert.deepEqual(issues.duplicateLoopGroundings, []);
    assert.deepEqual(issues.metaLoopGroundings, []);
    assert.equal(issues.subtotal, 0);
});

test("reasonNativeIssuesOf reports a meta record that grounds the derivation loop", () => {
    const issues = reasonNativeOf([{ domain: "pag", grounds: ["reasoning:derivation-loop"], id: "k1", meta: true }]);
    assert.deepEqual(issues.metaLoopGroundings, ["k1"]);
    assert.equal(issues.subtotal, 1);
});

test("reasonNativeIssuesOf reports a meta record named with the kernel suffix, and passes a non-meta one", () => {
    const meta = reasonNativeOf([{ domain: "pag", id: "foo-kernel", meta: true }]);
    assert.deepEqual(meta.metaKernelNaming, ["foo-kernel"]);
    const plain = reasonNativeOf(
        [
            {
                derivationMap: [{ record: "r", stage: "verify" }],
                domain: "pag",
                id: "foo-kernel",
                mathType: "logic",
                yields: "boolean",
            },
        ],
        withRecord,
    );
    assert.deepEqual(plain.metaKernelNaming, []);
    assert.equal(plain.subtotal, 0);
});

test("reasonNativeIssuesOf reports a tiered record with no mathType or yields, and exempts a meta record", () => {
    assert.deepEqual(reasonNativeOf([{ domain: "architecture", id: "c1" }]).untypedRecords, ["c1"]);
    const meta = reasonNativeOf([{ domain: "architecture", id: "c1", meta: true }]);
    assert.deepEqual(meta.untypedRecords, []);
    assert.equal(meta.subtotal, 0);
});

test("reasonNativeIssuesOf demands a stage on a process record and not on a leaf record", () => {
    const process = reasonNativeOf([{ domain: "pag", id: "c1", mathType: "logic", yields: "boolean" }]);
    assert.deepEqual(process.unstagedProcessRecords, ["c1"]);
    const leaf = reasonNativeOf([{ domain: "architecture", id: "c1", mathType: "logic", yields: "boolean" }]);
    assert.deepEqual(leaf.unstagedProcessRecords, []);
    assert.equal(leaf.subtotal, 0);
});

test("a domain tier outside the closed vocabulary fails the load, and every declared tier loads", () => {
    for (const tier of DOMAIN_TIER_VALUES) {
        assert.equal(asClosed(DOMAIN_TIER_VALUES, tier, "algo: a planted tier"), tier);
    }
    assert.throws(
        () => asClosed(DOMAIN_TIER_VALUES, "brand-new-grammar", "algo: a planted tier"),
        (error: unknown) => error instanceof Error && error.message.includes('declares "brand-new-grammar"'),
    );
});

test("reasonNativeIssuesOf passes a tiered and an exempt domain", () => {
    const issues = reasonNativeOf([{ domain: "Architectural Clusters", id: "c1", meta: true }, VALID_PROCESS]);
    assert.equal(issues.subtotal, 0);
});

test("the bundled context resolves with no reason-native or integrity issue", () => {
    const issues = createGovlabContext().validateResolution();
    assert.equal(issues.reasonNative.subtotal, 0);
    assert.equal(issues.integrity.subtotal, 0);
    assert.equal(issues.total, 0);
});
