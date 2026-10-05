import {
    activeSet,
    contractOf,
    countBreaches,
    inspectSurface,
    rowMarkersOf,
} from "coordination-surface/tools/core/coordinators/checklist.coordinator.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { join } from "node:path";
import { mkdtempSync } from "node:fs";
import { projectRoot } from "coordination-surface/config/surface.config.ts";
import { tmpdir } from "node:os";

const ROOT = projectRoot();

const emptyRoot = function emptyRoot(): string {
    return mkdtempSync(join(tmpdir(), "coordination-checklist-"));
};

describe("contractOf and rowMarkersOf", () => {
    it("reads the phase contract and the row markers from the package's own templates", () => {
        const contract = contractOf(ROOT);
        assert.equal(Array.isArray(contract.dependencyAxes), true);
        assert.equal(Array.isArray(rowMarkersOf(ROOT)), true);
    });

    it("reads no row markers when the planning template is absent", () => {
        const root = emptyRoot();
        assert.deepEqual(rowMarkersOf(root), []);
    });
});

describe("activeSet", () => {
    it("is empty when the board is absent", () => {
        const root = emptyRoot();
        assert.equal(activeSet(root).size, 0);
    });
});

describe("countBreaches", () => {
    it("reports a count stated as a literal before a derived noun, outside code spans and fences", () => {
        const lines = ["The plan holds 3 phases.", "The `4 rules` are quoted.", "```", "5 tasks", "```"];
        assert.deepEqual(
            countBreaches(lines).map((breach) => [breach.kind, breach.line, breach.locus]),
            [["literalCount", 1, "3 phases"]],
        );
    });
});

describe("inspectSurface", () => {
    it("stops at the contract check when the surface declares no task", () => {
        const contract = contractOf(ROOT);
        const report = inspectSurface("plan.md", ["prose only"], contract, new Set(), ["file"]);
        assert.deepEqual(report, { breaches: [], derivations: { breaches: 0, contractDeclared: false } });
    });
});
