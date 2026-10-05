import {
    TENSION_REQUIRED,
    checkSchema,
    checkTension,
    recordFinding,
} from "coordination-surface/tools/core/validators/record.validator.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const PATH = "records.md";

const rulesOf = function rulesOf(findings: readonly { readonly rule: string }[]): string[] {
    return findings.map((finding) => finding.rule);
};

const tension = function tension(keys: Readonly<Record<string, string>>): Record<string, string> {
    return { ...Object.fromEntries(TENSION_REQUIRED.map((key) => [key, "x"])), ...keys };
};

const tensionRules = function tensionRules(keys: Readonly<Record<string, string>>, complete = true): string[] {
    const findings = checkTension(PATH, { id: "T1", keys: complete ? tension(keys) : keys, line: 1 });
    return rulesOf(findings);
};

describe("recordFinding", () => {
    it("builds a declare finding under the record rule family", () => {
        const finding = recordFinding("missingKey", PATH, 3, "R1", "R1 has no source", "add source");
        assert.equal(finding.rule, "record/missingKey");
        assert.equal(finding.remediation.decide, "add source");
        assert.deepEqual(finding.stack.at(-1), { check: "missingKey", resolved: "failed" });
    });
});

describe("checkSchema", () => {
    it("reports a missing key, a tier or derivation outside the vocabulary, and a dispute left unsurfaced", () => {
        const record = {
            id: "R1",
            keys: { confidence: "guess", derivation: "stolen", statement: "s", status: "disputed", type: "fact" },
            line: 3,
        };
        assert.deepEqual(rulesOf(checkSchema(PATH, record)), [
            "record/missingKey",
            "record/unknownTier",
            "record/unknownDerivation",
            "record/disputedNotSurfaced",
        ]);
        const clean = {
            id: "R2",
            keys: {
                confidence: "inferred",
                see: "R1",
                source: "here",
                statement: "s",
                status: "disputed",
                type: "fact",
            },
            line: 9,
        };
        assert.deepEqual(checkSchema(PATH, clean), []);
    });
});

describe("checkTension", () => {
    it("reports a missing key, an unknown kind, and a kind its incompatibility contradicts", () => {
        assert.equal(tensionRules({ kind: "real" }, false).length, TENSION_REQUIRED.length - 1);
        assert.deepEqual(tensionRules({ kind: "odd" }), ["record/unknownKind"]);
        assert.deepEqual(tensionRules({ incompatible: "b", kind: "apparent" }), ["record/kindContradiction"]);
        assert.deepEqual(tensionRules({ incompatible: "none", kind: "real" }), ["record/kindContradiction"]);
        assert.deepEqual(tensionRules({ incompatible: "none", kind: "apparent" }), []);
    });
});
