import { PHASE_MARKER, TASK_MARKER } from "coordination-surface/tools/core/constants/checklist.constants.ts";
import { describe, it } from "vitest";
import {
    inspectProtocol,
    putToWork,
    scaffoldLabels,
} from "coordination-surface/tools/core/inspectors/checklist.inspector.ts";
import { MANDATORY_GATES } from "coordination-surface/tools/core/constants/template.constants.ts";
import type { ProtocolFinding } from "coordination-surface/tools/core/types/checklist.types.ts";
import type { TemplateContract } from "coordination-surface/tools/core/types/template.types.ts";
import assert from "node:assert/strict";

const CONTRACT: TemplateContract = {
    confidenceThreshold: 0,
    dependencyAxes: ["axis_d", "axis_s"],
    genesisStages: ["seed", "grow"],
    rippleDimensions: ["cost", "risk"],
};

const kindsOf = function kindsOf(findings: readonly ProtocolFinding[]): string[] {
    return findings.map((finding) => finding.kind);
};

describe("scaffoldLabels and putToWork", () => {
    it("derives the scaffold labels from the contract and reads whether the artifact distributes work", () => {
        assert.deepEqual(scaffoldLabels(CONTRACT), ["D:", "S:", "COST", "RISK", "SEED", "GROW"]);
        assert.equal(putToWork(["DISTRIBUTES: two seats"]), true);
        assert.equal(putToWork(["DISTRIBUTES:", "prose"]), false);
    });
});

describe("inspectProtocol", () => {
    it("reports a file that declares no task and no phase, unless it is retired", () => {
        assert.deepEqual(kindsOf(inspectProtocol(["prose only"], CONTRACT)), ["notAChecklist"]);
        assert.deepEqual(inspectProtocol(["RETIRED: folded into another"], CONTRACT), []);
    });

    it("reports unnamed gates, an incomplete phase once work is distributed, and a pre-checked box", () => {
        const lines = [
            "DISTRIBUTES: two seats",
            `${PHASE_MARKER}build`,
            "D: none",
            "ripple: cost",
            TASK_MARKER,
            "- [x] shipped already",
        ];
        const findings = inspectProtocol(lines, CONTRACT);
        assert.deepEqual(kindsOf(findings), [
            "gateUnnamed",
            "axesMissing",
            "rippleMissing",
            "genesisMissing",
            "precheckedGate",
        ]);
        assert.equal(findings[0]?.locus, MANDATORY_GATES.join(", "));
    });

    it("reports nothing for a complete, distributed phase naming every gate", () => {
        const lines = [
            "DISTRIBUTES: two seats",
            `${PHASE_MARKER}build`,
            "D: none S: none",
            "ripple: cost, risk",
            "genesis: seed",
            TASK_MARKER,
            MANDATORY_GATES.join(" "),
        ];
        assert.deepEqual(inspectProtocol(lines, CONTRACT), []);
    });
});
