import { declarationOutcome, duplicateFindings } from "coordination-surface/tools/core/resolvers/coverage.resolver.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const entry = function entry(slug: string, gate: string, path = "rules/a.md"): Parameters<typeof duplicateFindings>[0] {
    return { declared: { gate, line: 2, locked: false, slug }, path };
};

describe("duplicateFindings", () => {
    it("reports a slug an earlier declaration already holds, and nothing for a new one", () => {
        const [finding] = duplicateFindings(entry("one-writer", "board"), [entry("one-writer", "board", "rules/b.md")]);
        assert.ok(finding !== undefined);
        assert.equal(finding.rule, "coverage/duplicateSlug");
        assert.ok(finding.actual.includes("rules/b.md"));
        assert.deepEqual(duplicateFindings(entry("one-writer", "board"), []), []);
    });
});

describe("declarationOutcome", () => {
    it("routes a rule by its gate, reporting an ungated backlog, an unknown gate and an unproven conduct claim", () => {
        const ungated = declarationOutcome(entry("a", "none"), "", new Set());
        assert.equal(ungated.route, "ungated");
        assert.equal(ungated.findings[0]?.rule, "coverage/ungatedBacklog");

        const unknown = declarationOutcome(entry("b", "board/ghost"), "", new Set(["board"]));
        assert.equal(unknown.route, "gated");
        assert.equal(unknown.findings[0]?.rule, "coverage/unknownGate");
        assert.deepEqual(declarationOutcome(entry("b", "board"), "", new Set(["board"])).findings, []);

        const unproven = declarationOutcome(entry("c", "conduct"), "", new Set());
        assert.equal(unproven.route, "conduct");
        assert.equal(unproven.findings[0]?.rule, "coverage/unprovenConduct");
        assert.deepEqual(declarationOutcome(entry("c", "conduct"), "| `c` | proof |", new Set()).findings, []);
    });
});
