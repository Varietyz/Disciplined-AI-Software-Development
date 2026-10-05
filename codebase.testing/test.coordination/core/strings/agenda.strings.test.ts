import { describe, it } from "vitest";
import { invariantTaken, planContended } from "coordination-surface/tools/core/strings/agenda.strings.ts";
import assert from "node:assert/strict";

describe("the agenda messages", () => {
    it("name the invariant already planned and the plan that moved", () => {
        assert.ok(invariantTaken("lost-update").includes("lost-update"));
        assert.ok(planContended("agenda.config.ts").includes("agenda.config.ts"));
    });
});
