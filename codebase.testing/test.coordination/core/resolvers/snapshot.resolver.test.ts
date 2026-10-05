import { describe, it } from "vitest";
import { unreadEcho, unreadSince } from "coordination-surface/tools/core/resolvers/snapshot.resolver.ts";
import assert from "node:assert/strict";
import { unreadItems } from "coordination-surface/tools/core/strings/snapshot.strings.ts";

const item = function item(key: string, at: number): string {
    return [`┌─── AGENT ${key} at:${String(at)} to:*`, "body", `└─── END AGENT ${key}`].join("\n");
};

describe("unreadSince and unreadEcho", () => {
    it("name the items other seats posted since a seat's snapshot, with their authors and the time they span", () => {
        const snapshot = item("B-1", 1000);
        const current = [snapshot, item("A-1", 2000), item("B-2", 5000), item("C-1", 3000)].join("\n");
        const interval = unreadSince(current, snapshot, "A");
        assert.deepEqual(interval, { agents: ["B", "C"], earliest: 3000, keys: ["B-2", "C-1"], latest: 5000 });
        assert.equal(unreadEcho(interval, "board.md"), unreadItems(["B", "C"], "board.md", 2, ["B-2", "C-1"]));
    });

    it("answer nothing without a snapshot or with nothing new", () => {
        assert.equal(unreadSince(item("B-1", 1), null, "A"), null);
        assert.equal(unreadSince(item("B-1", 1), item("B-1", 1), "A"), null);
        assert.equal(unreadEcho(null, "board.md"), "");
    });
});
