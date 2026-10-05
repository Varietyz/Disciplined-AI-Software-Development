import { describe, it } from "vitest";
import {
    readDeclaredRules,
    readExpandedSlugs,
    stripGateDeclarations,
} from "coordination-surface/tools/core/readers/rule.reader.ts";
import assert from "node:assert/strict";

const SOURCE = [
    "## `read_first` (LOCKED)",
    "Read before acting · gate: conduct",
    "More prose · gate: check",
    "- `one_run` runs once · gate: check",
    "- `no_gate` states nothing",
    "## `not a slug` trailing words",
    "text · gate: conduct",
].join("\n");

describe("readDeclaredRules", () => {
    it("reads listed rules and the first gate under a slug heading, carrying the lock", () => {
        assert.deepEqual(readDeclaredRules(SOURCE), [
            { gate: "conduct", line: 2, locked: true, slug: "read_first" },
            { gate: "check", line: 4, locked: false, slug: "one_run" },
        ]);
    });
});

describe("readExpandedSlugs", () => {
    it("reads each heading that is a backticked slug alone or locked", () => {
        assert.deepEqual(readExpandedSlugs(SOURCE), [{ line: 1, slug: "read_first" }]);
    });
});

describe("stripGateDeclarations", () => {
    it("removes each gate declaration with the separator before it", () => {
        assert.equal(stripGateDeclarations("Read first · gate: conduct\nno gate here"), "Read first\nno gate here");
        assert.equal(stripGateDeclarations("gate: 42"), "gate: 42");
    });
});
