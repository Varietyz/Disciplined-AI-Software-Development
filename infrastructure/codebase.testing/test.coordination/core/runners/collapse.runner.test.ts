import {
    COMPRESS_NEEDS_AGENT,
    compressionNoRecord,
    itemDropped,
    noMarkedField,
    nothingToCompress,
} from "coordination-surface/tools/core/strings/board.strings.ts";
import { describe, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { EMPTY_EXTRACTION } from "coordination-surface/tools/core/validators/archive.validator.ts";
import assert from "node:assert/strict";
import { compressNeedsExtracted } from "coordination-surface/tools/core/strings/archive.strings.ts";
import { join } from "node:path";
import { runCompression } from "coordination-surface/tools/core/runners/collapse.runner.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const TARGET = "board.txt";

const BOARD = [
    "┌─── AGENT A",
    "Agent A — ACTIVE",
    "  Status: working on the index",
    "  Flags: —",
    "└─── END AGENT A",
    "┌─── AGENT A-1 at:1 to:B",
    "take the index",
    "└─── END AGENT A-1",
    "",
].join("\n");

const CHANGELOG = "history.txt";

type Request = Parameters<typeof runCompression>[0];

const requestIn = function requestIn(root: string): Request {
    return {
        absolute: join(root, TARGET),
        agent: "A",
        archive: join(root, CHANGELOG),
        changelog: CHANGELOG,
        extracted: EMPTY_EXTRACTION,
        heal: true,
        marker: "Status",
        target: TARGET,
    };
};

describe("runCompression", () => {
    it("refuses a missing surface, a call with no seat and one with no extraction", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-collapse-"));
        try {
            const request = requestIn(root);
            assert.equal(runCompression(request).message, nothingToCompress(TARGET));
            writeVerbatim(request.absolute, BOARD);
            assert.equal(runCompression({ ...request, agent: null }).message, COMPRESS_NEEDS_AGENT);
            assert.equal(runCompression({ ...request, extracted: null }).message, compressNeedsExtracted(CHANGELOG));
            assert.equal(runCompression({ ...request, agent: "C" }).message, compressionNoRecord("C"));
            assert.equal(runCompression({ ...request, marker: "Owns" }).message, noMarkedField(TARGET));
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });

    it("empties a schema field in the seat's own record, and drops an item by its key", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-collapse-"));
        try {
            const request = requestIn(root);
            const { absolute } = request;
            writeVerbatim(absolute, BOARD);
            const emptied = runCompression(request);
            assert.deepEqual([emptied.code, emptied.excised], [0, ["Status: working on the index"]]);
            assert.ok(readFileSync(absolute, "utf8").includes("  Status:  —"));

            const dropped = runCompression({ ...request, marker: "A-1" });
            assert.equal(
                dropped.message,
                itemDropped(
                    "A-1",
                    ["┌─── AGENT A-1 at:1 to:B", "take the index", "└─── END AGENT A-1"].join("\n").length,
                    true,
                ),
            );
            assert.ok(!readFileSync(absolute, "utf8").includes("AGENT A-1"));
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
