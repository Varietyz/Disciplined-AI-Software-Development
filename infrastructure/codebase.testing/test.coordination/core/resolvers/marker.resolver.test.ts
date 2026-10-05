import { classBoundLeads, declaredLeads } from "coordination-surface/tools/core/resolvers/marker.resolver.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const ACCUMULATOR = [
    "Entries open with `POPULATION:` and `BOUNDARY:`, which presuppose a CLASS.",
    "A note may carry `NOTE:` or `lower:` too.",
    "### lost-update",
    "`LATER:` inside an entry is not declared.",
].join("\n");

describe("declaredLeads and classBoundLeads", () => {
    it("read the uppercase leads the preamble names, and the ones it marks as presupposing a class", () => {
        assert.deepEqual(declaredLeads(ACCUMULATOR), ["POPULATION:", "BOUNDARY:", "NOTE:"]);
        assert.deepEqual(classBoundLeads(ACCUMULATOR), ["POPULATION:", "BOUNDARY:"]);
        assert.deepEqual(declaredLeads("### only entries\n`A:`"), []);
    });
});
