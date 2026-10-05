import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { isImmutable } from "coordination-surface/tools/core/predicates/placement.predicate.ts";
import { surfacePath } from "coordination-surface/config/surface.config.ts";

describe("isImmutable", () => {
    it("holds a path whose declared lifetime is frozen and never removed, and releases any other", () => {
        assert.equal(isImmutable(`${surfacePath("archive")}/old.md`), true);
        assert.equal(isImmutable(surfacePath("board")), false);
        assert.equal(isImmutable("undeclared/path.md"), false);
    });
});
