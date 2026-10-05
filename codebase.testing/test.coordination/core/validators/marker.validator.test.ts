import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { unboundedEntries } from "coordination-surface/tools/core/validators/marker.validator.ts";

const ACCUMULATOR = [
    "# History",
    "## ENTRIES",
    "### lost-update",
    "POPULATION: two seats",
    "### missing-lead",
    "prose only",
    "### with-instances",
    "INSTANCES: listed below",
    "### A prose heading",
    "no lead",
].join("\n");

describe("unboundedEntries", () => {
    it("names each class entry without the lead, and lets a class-bound accumulator's instance list stand in", () => {
        assert.deepEqual(
            unboundedEntries(ACCUMULATOR, "POPULATION:").map((entry) => entry.heading),
            ["missing-lead", "with-instances"],
        );
        assert.deepEqual(
            unboundedEntries(ACCUMULATOR, "POPULATION:", true).map((entry) => [entry.heading, entry.line]),
            [["missing-lead", 5]],
        );
        assert.deepEqual(unboundedEntries(ACCUMULATOR, ""), []);
        assert.deepEqual(unboundedEntries("### no-entries-marker", "POPULATION:"), []);
    });
});
