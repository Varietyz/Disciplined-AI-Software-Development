import { describe, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { NOBODY_TAKING_PART } from "coordination-surface/tools/core/strings/converge.strings.ts";
import assert from "node:assert/strict";
import { convergenceEdges } from "coordination-surface/tools/core/validators/converge.validator.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("convergenceEdges", () => {
    it("judges every convergence edge in order, and holds none that needs a seat when nobody takes part", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-converge-"));
        try {
            const edges = convergenceEdges(root, "probe.venue.md", "# Venue\n", "", "", "", []);
            assert.deepEqual(
                edges.map((edge) => edge.step),
                ["needs", "signatures", "durable", "successor", "directives", "absorption", "inheritance"],
            );
            const byStep = new Map(edges.map((edge) => [edge.step, edge]));
            for (const step of ["needs", "signatures", "durable"]) {
                assert.deepEqual([byStep.get(step)?.holds, byStep.get(step)?.detail], [false, NOBODY_TAKING_PART]);
            }
            assert.equal(byStep.get("directives")?.holds, true);
            assert.equal(byStep.get("inheritance")?.holds, true);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
