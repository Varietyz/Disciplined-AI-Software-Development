import { describe, it } from "vitest";
import {
    duplicateTwinOf,
    itemSpans,
    openVenues,
    seenItems,
    spanText,
    surfaceEntries,
    withoutSpans,
} from "coordination-surface/tools/core/resolvers/sweep.resolver.ts";
import { join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { surfacePrefix } from "coordination-surface/config/surface.config.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const item = function item(key: string, at: number, to: string, body: string): string[] {
    return [`┌─── AGENT ${key} at:${String(at)} to:${to}`, body, `└─── END AGENT ${key}`];
};

const BOARD = [
    "# Board",
    ...item("A-1", 100, "B", "read the draft"),
    ...item("B-1", 200, "A", "read mine"),
    ...item("A-2", 300, "*", "read the draft"),
    "```",
    ...item("C-1", 50, "A", "fenced"),
    "```",
].join("\n");

describe("itemSpans", () => {
    it("reads every unfenced item with its author, stamp, readers and line span", () => {
        assert.deepEqual(
            itemSpans(BOARD).map((span) => [span.key, span.agent, span.at, span.to, span.from, span.through]),
            [
                ["A-1", "A", 100, ["B"], 1, 3],
                ["B-1", "B", 200, ["A"], 4, 6],
                ["A-2", "A", 300, [], 7, 9],
            ],
        );
    });
});

describe("seenItems, spanText and withoutSpans", () => {
    it("select an item every addressed reader has since posted after, and cut it out of the board", () => {
        const spans = itemSpans(BOARD);
        const seen = seenItems(spans);
        assert.deepEqual(
            seen.map((span) => span.key),
            ["A-1", "B-1"],
        );
        const [first] = spans;
        assert.ok(first !== undefined);
        assert.equal(spanText(BOARD, first), item("A-1", 100, "B", "read the draft").join("\n"));
        assert.ok(!withoutSpans(BOARD, seen).includes("AGENT A-1"));
        assert.ok(withoutSpans(BOARD, seen).includes("AGENT A-2"));
    });
});

describe("duplicateTwinOf", () => {
    it("names another item by the same author with the same body, and none for a unique item", () => {
        assert.equal(duplicateTwinOf(BOARD, "A-2"), "A-1");
        assert.equal(duplicateTwinOf(BOARD, "B-1"), null);
        assert.equal(duplicateTwinOf(BOARD, "Z-9"), null);
    });
});

describe("surfaceEntries and openVenues", () => {
    it("list every entry under the surface, and the venues outside the archive", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-sweep-"));
        try {
            const surface = resolve(root, surfacePrefix());
            mkdirSync(join(surface, "archive"), { recursive: true });
            writeVerbatim(join(surface, "a.venue.md"), "");
            writeVerbatim(join(surface, "archive", "b.venue.md"), "");
            const entries = surfaceEntries(root);
            const prefix = surfacePrefix().length === 0 ? "" : `${surfacePrefix()}/`;
            assert.deepEqual(openVenues(entries, `${prefix}archive`, ".venue.md"), [`${prefix}a.venue.md`]);
            assert.deepEqual(openVenues([String.raw`x\y.venue.md`], "archive", ".venue.md"), ["x/y.venue.md"]);
            assert.deepEqual(surfaceEntries(join(root, "absent")), []);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
