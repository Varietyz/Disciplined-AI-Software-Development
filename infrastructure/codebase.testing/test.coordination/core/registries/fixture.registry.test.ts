import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { discoverFixtures } from "coordination-surface/tools/core/registries/fixture.registry.ts";
import { projectRoot } from "coordination-surface/config/surface.config.ts";

describe("discoverFixtures", () => {
    it("loads the package's own fixtures into gates and branches, and reports none unreadable", async () => {
        const registry = await discoverFixtures(projectRoot());
        assert.equal(registry.gates.length > 0, true);
        assert.equal(registry.branches.length > 0, true);
        assert.deepEqual(registry.unreadable, []);
        assert.equal(registry.sources.length > 0, true);
    });
});
