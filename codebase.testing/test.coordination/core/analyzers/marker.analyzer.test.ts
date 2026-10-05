import { carriesMarker, repeatedSpan } from "coordination-surface/tools/core/analyzers/marker.analyzer.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

describe("repeatedSpan", () => {
    it("returns the first run of words that appears twice, ignoring case and punctuation", () => {
        assert.equal(repeatedSpan("The gate holds. Later, the GATE HOLDS again.", 3), "the gate holds");
    });

    it("returns null when the text is too short or no run repeats", () => {
        assert.equal(repeatedSpan("one two", 2), null);
        assert.equal(repeatedSpan("one two three four five six", 2), null);
    });
});

describe("carriesMarker", () => {
    it("finds a marker that stands alone and ends its clause", () => {
        assert.equal(carriesMarker("Status: DONE", "DONE"), true);
        assert.equal(carriesMarker("marked DONE, then moved", "DONE"), true);
    });

    it("ignores a marker inside a word, joined by a hyphen, in balanced quotes, or followed by more words", () => {
        assert.equal(carriesMarker("UNDONE work", "DONE"), false);
        assert.equal(carriesMarker("half-DONE", "DONE"), false);
        assert.equal(carriesMarker("the `DONE` marker", "DONE"), false);
        assert.equal(carriesMarker("DONE with the draft", "DONE"), false);
    });
});
