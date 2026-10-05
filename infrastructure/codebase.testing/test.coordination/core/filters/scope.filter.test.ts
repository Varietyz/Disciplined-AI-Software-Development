import { describe, it } from "vitest";
import { outsideRoots, underRoots } from "coordination-surface/tools/core/filters/scope.filter.ts";
import assert from "node:assert/strict";

const PATHS = ["kit/core/a.ts", "kit/rules/b.ts", "config/c.ts", "kit/core/d.ts"];

describe("underRoots and outsideRoots", () => {
    it("splits the paths by whether any root prefixes them, keeping each path once and in order", () => {
        const roots = ["kit/core/", "kit/"];
        assert.deepEqual(underRoots(PATHS, roots), ["kit/core/a.ts", "kit/rules/b.ts", "kit/core/d.ts"]);
        assert.deepEqual(outsideRoots(PATHS, roots), ["config/c.ts"]);
    });

    it("places every path outside when no root is given", () => {
        assert.deepEqual(underRoots(PATHS, []), []);
        assert.deepEqual(outsideRoots(PATHS, []), PATHS);
    });
});
