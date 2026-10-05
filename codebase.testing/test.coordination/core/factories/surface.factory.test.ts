import {
    WRITE_ENTRYPOINT,
    noWritePathFinding,
    unassessedFinding,
    unretractableFinding,
} from "coordination-surface/tools/core/factories/surface.factory.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

describe("surface findings", () => {
    it("file an unassessed form and an unretractable region against the form registry", () => {
        const unassessed = unassessedFinding("--probe");
        assert.equal(unassessed.rule, "surface/unassessedWriteForm");
        assert.equal(unassessed.locus, "--probe");
        assert.ok(unassessed.path.endsWith("registries/surface.registry.ts"));

        const region = unretractableFinding("DEFERRED");
        assert.equal(region.rule, "surface/unretractableWriteRegion");
        assert.equal(region.remediation.target, WRITE_ENTRYPOINT);
    });

    it("names the operand and member a refusing mechanism requires and no write path reaches", () => {
        const finding = noWritePathFinding({
            from: "board/rule",
            member: "Status",
            operand: "field",
            refusal: "refuses a record without a Status",
            target: "board.md",
        });
        assert.equal(finding.rule, "surface/noWritePath");
        assert.equal(finding.locus, "board/rule:field Status");
        assert.equal(finding.path, "board.md");
    });
});
