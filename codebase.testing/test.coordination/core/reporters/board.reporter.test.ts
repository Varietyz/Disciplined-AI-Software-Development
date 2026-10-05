import {
    changedSince,
    firstSnapshot,
    surfaceUnchanged,
} from "coordination-surface/tools/core/strings/board.strings.ts";
import { describe, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { changesSince } from "coordination-surface/tools/core/reporters/board.reporter.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const TARGET = "board.txt";

describe("changesSince", () => {
    it("takes a first snapshot, then hands a seat nothing for an unchanged surface and the changed lines after a write", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-changes-"));
        try {
            const absolute = join(root, TARGET);
            assert.equal(changesSince(root, absolute, "A", TARGET), "");
            writeVerbatim(absolute, "# Board\nfirst line\n");
            assert.equal(changesSince(root, absolute, "A", TARGET), firstSnapshot("A"));
            assert.equal(changesSince(root, absolute, "A", TARGET), surfaceUnchanged(TARGET, "A"));
            writeVerbatim(absolute, "# Board\nfirst line\nan owner entry\n");
            const delivered = changesSince(root, absolute, "A", TARGET);
            assert.ok(delivered.startsWith(changedSince("A", 1)));
            assert.ok(delivered.includes("an owner entry"));
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
