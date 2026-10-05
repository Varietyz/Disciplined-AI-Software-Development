import { describe, it } from "vitest";
import {
    lastInteraction,
    pruneUnkeyedSnapshots,
    readDelivered,
    readFieldMark,
    readSnapshot,
    recordDelivered,
    unkeyedSnapshots,
    wasDelivered,
    writeFieldMark,
    writeSnapshot,
} from "coordination-surface/tools/core/registries/snapshot.registry.ts";
import { mkdtempSync, rmSync } from "node:fs";
import { GENERATED_DIR } from "coordination-surface/tools/core/constants/path.constants.ts";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const withRoot = function withRoot(probe: (root: string) => void): void {
    const root = mkdtempSync(join(tmpdir(), "snapshot-registry-"));
    try {
        probe(root);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
};

describe("snapshots and field marks", () => {
    it("reads back what was written per agent and surface, and reads nothing before a write", () => {
        withRoot((root) => {
            assert.equal(readSnapshot(root, "A", "collab.comms"), null);
            assert.equal(readFieldMark(root, "A"), 0);
            assert.equal(lastInteraction(root, "A"), 0);

            writeSnapshot(root, "A", "collab.comms", "board text");
            writeFieldMark(root, "A", 42);

            assert.equal(readSnapshot(root, "A", "collab.comms"), "board text");
            assert.equal(readFieldMark(root, "A"), 42);
            assert.equal(lastInteraction(root, "A") > 0, true);
        });
    });

    it("prunes snapshots that carry no surface key", () => {
        withRoot((root) => {
            writeSnapshot(root, "A", "collab.comms", "keyed");
            writeVerbatim(join(root, GENERATED_DIR, "board.snapshots", "A.snapshot.generated.txt"), "legacy");
            assert.deepEqual(unkeyedSnapshots(root), ["A.snapshot.generated.txt"]);
            assert.deepEqual(pruneUnkeyedSnapshots(root), ["A.snapshot.generated.txt"]);
            assert.deepEqual(unkeyedSnapshots(root), []);
        });
    });
});

describe("delivered keys", () => {
    it("records each key once and answers whether it was delivered", () => {
        withRoot((root) => {
            recordDelivered(root, "A", []);
            recordDelivered(root, "A", ["k1", "k2", "k1"]);
            recordDelivered(root, "A", ["k2", "k3"]);
            assert.deepEqual([...readDelivered(root, "A")], ["k1", "k2", "k3"]);
            assert.equal(wasDelivered(root, "A", "k3"), true);
            assert.equal(wasDelivered(root, "B", "k3"), false);
        });
    });
});
