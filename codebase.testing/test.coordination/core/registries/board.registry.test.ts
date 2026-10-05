import {
    currentWaiters,
    releaseAgent,
    releaseWaiter,
    waitersPath,
    writeWaiters,
} from "coordination-surface/tools/core/registries/board.registry.ts";
import { describe, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const withRoot = function withRoot(probe: (root: string) => void): void {
    const root = mkdtempSync(join(tmpdir(), "board-registry-"));
    try {
        probe(root);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
};

describe("currentWaiters, releaseWaiter and releaseAgent", () => {
    it("keeps unexpired waiters and releases one by id or every one an agent holds", () => {
        withRoot((root) => {
            writeWaiters(root, [
                { agent: "A", expiresAt: 100, id: "a1" },
                { agent: "A", expiresAt: 300, id: "a2" },
                { agent: "B", expiresAt: 300, id: "b1" },
            ]);
            assert.deepEqual(
                currentWaiters(root, 200).map((waiter) => waiter.id),
                ["a2", "b1"],
            );

            releaseWaiter(root, "b1", 200);
            assert.deepEqual(
                currentWaiters(root, 200).map((waiter) => waiter.id),
                ["a2"],
            );

            releaseAgent(root, "A", 200);
            assert.deepEqual(currentWaiters(root, 200), []);
        });
    });

    it("reads no waiters from a missing, unreadable or malformed file", () => {
        withRoot((root) => {
            assert.deepEqual(currentWaiters(root, 0), []);
            writeWaiters(root, []);
            writeVerbatim(waitersPath(root), "{ not json");
            assert.deepEqual(currentWaiters(root, 0), []);
            writeVerbatim(waitersPath(root), '[{"id":1}]');
            assert.deepEqual(currentWaiters(root, 0), []);
        });
    });
});
