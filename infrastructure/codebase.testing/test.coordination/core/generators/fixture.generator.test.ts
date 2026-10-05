import { describe, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { growFixtureTree } from "coordination-surface/tools/core/generators/fixture.generator.ts";
import { join } from "node:path";

describe("growFixtureTree", () => {
    it("writes each sample at its path under a fresh root, and removes the root on release", () => {
        const tree = growFixtureTree([
            { path: "a.md", text: "alpha" },
            { path: "nested/b.md", text: "beta" },
        ]);
        assert.equal(readFileSync(join(tree.root, "nested", "b.md"), "utf8"), "beta");
        tree.release();
        assert.equal(existsSync(tree.root), false);
    });
});
