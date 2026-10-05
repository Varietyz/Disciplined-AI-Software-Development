import { describe, it } from "vitest";
import { sameDocument, sameRow } from "coordination-surface/tools/core/normalizers/document.normalizer.ts";
import assert from "node:assert/strict";

const RENDERED = ["# Binding", "Prose line.", "| slot | state |", "|---|---|", "| `{a}` | ABSENT |", ""].join("\n");

const FORMATTED = [
    "# Binding",
    "",
    "Prose line.",
    "",
    "| slot  | state  |",
    "| ----- | ------ |",
    "| `{a}` | ABSENT |",
].join("\n");

describe("sameRow", () => {
    it("compares rows by their cells and reads any divider run as one divider", () => {
        assert.equal(sameRow("| a   | b |", "|a|b|"), true);
        assert.equal(sameRow("| --- | :-: |", "|---|---|"), false);
        assert.equal(sameRow("| ----- | - |", "|---|---|"), true);
        assert.equal(sameRow("| a | b |", "| a | c |"), false);
    });
});

describe("sameDocument", () => {
    it("reads a formatter's padding and blank lines as no change", () => {
        assert.equal(sameDocument(FORMATTED, RENDERED), true);
    });

    it("reads a changed cell or a changed line as a change", () => {
        assert.equal(sameDocument(FORMATTED.replace("ABSENT", "RESOLVED"), RENDERED), false);
        assert.equal(sameDocument(FORMATTED.replace("Prose line.", "Prose line"), RENDERED), false);
    });
});
