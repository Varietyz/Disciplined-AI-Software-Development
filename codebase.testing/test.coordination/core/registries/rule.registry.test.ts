import { describe, it } from "vitest";
import { discoverRules, identityOf } from "coordination-surface/tools/core/registries/rule.registry.ts";
import { STAGES } from "coordination-surface/tools/core/types/rule.types.ts";
import assert from "node:assert/strict";
import { projectRoot } from "coordination-surface/config/surface.config.ts";

describe("identityOf", () => {
    it("reads a rule's identity from its filename subject on either separator", () => {
        assert.equal(identityOf("kit/rules/board.rule.ts"), "board");
        assert.equal(identityOf(String.raw`kit\rules\board.rule.ts`), "board");
        assert.equal(identityOf("bare"), "bare");
    });
});

describe("discoverRules", () => {
    it("registers the package's own rules once each, in stage order, with no contract finding", async () => {
        const registry = await discoverRules(projectRoot());
        const ids = registry.rules.map((rule) => rule.id);
        const stages = registry.rules.map((rule) => STAGES.indexOf(rule.declaration.stage));

        assert.deepEqual(registry.findings, []);
        assert.equal(new Set(ids).size, ids.length);
        assert.deepEqual(
            stages,
            stages.toSorted((left, right) => left - right),
        );
    });
});
