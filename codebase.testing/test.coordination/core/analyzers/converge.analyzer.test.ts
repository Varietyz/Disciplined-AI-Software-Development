import {
    DEFERRAL_ARROW,
    DEFERRED_SECTION,
    SIGN_OFF_ABSENT,
    clauseLines,
    declaredHeading,
    declaredSuccessor,
    deferredClauses,
    headingIsWhole,
    sectionBound,
} from "coordination-surface/tools/core/analyzers/converge.analyzer.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const VENUE = [
    "# Venue",
    "SUCCESSOR: next-venue",
    `## ${DEFERRED_SECTION}`,
    `- **the index write** ${DEFERRAL_ARROW} next-venue, when the lock lands`,
    "- <placeholder clause>",
    `- ${SIGN_OFF_ABSENT}`,
    "## POSITIONS",
    `- a position ${DEFERRAL_ARROW} elsewhere`,
].join("\n");

describe("declaredHeading and headingIsWhole", () => {
    it("trim a declared heading, and accept only a non-empty kebab heading", () => {
        assert.equal(declaredHeading("  next-venue "), "next-venue");
        assert.equal(headingIsWhole("next-venue-2"), true);
        assert.equal(headingIsWhole("Next venue"), false);
        assert.equal(headingIsWhole("  "), false);
    });
});

describe("declaredSuccessor", () => {
    it("reads the successor field outside fences, and reads a placeholder or a missing field as none", () => {
        assert.equal(declaredSuccessor(VENUE), "next-venue");
        assert.equal(declaredSuccessor("SUCCESSOR: <name>"), "");
        assert.equal(declaredSuccessor("```\nSUCCESSOR: fenced\n```"), "");
    });
});

describe("sectionBound", () => {
    it("spans a section from its heading to the next boundary, and answers null for a missing one", () => {
        assert.deepEqual(sectionBound(VENUE, DEFERRED_SECTION), { from: 2, to: 6 });
        assert.deepEqual(sectionBound(VENUE, "POSITIONS"), { from: 6, to: 8 });
        assert.equal(sectionBound(VENUE, "ABSENT"), null);
    });
});

describe("deferredClauses and clauseLines", () => {
    it("read the stated clauses of a section with their receivers, skipping placeholders and the absent mark", () => {
        assert.deepEqual(deferredClauses(VENUE), { answered: true, clauses: ["the index write"], declared: true });
        assert.deepEqual(clauseLines(VENUE, "POSITIONS"), [{ clause: "a position", receiver: "elsewhere" }]);
        assert.deepEqual(deferredClauses("# Venue"), { answered: false, clauses: [], declared: false });
    });
});
