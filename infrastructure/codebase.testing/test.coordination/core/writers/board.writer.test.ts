import { describe, it } from "vitest";
import { landWitnessed, refuse } from "coordination-surface/tools/core/writers/board.writer.ts";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const BEFORE = ["# Board", "┌─── AGENT A", "  status: before", "└─── END AGENT A", ""].join("\n");

describe("landWitnessed", () => {
    it("writes when the board is unchanged, retries when another seat changed it, and refuses when the seat's own record moved", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-land-"));
        try {
            const absolute = join(root, "board.txt");
            const witnessed = { absolute, agent: "A", before: BEFORE, target: "board.txt", written: "landed" };
            const landed = refuse("landed", 0);
            const retried = refuse("retried", 0);

            writeVerbatim(absolute, BEFORE);
            assert.equal(
                landWitnessed(witnessed, landed, () => retried),
                landed,
            );
            assert.equal(readFileSync(absolute, "utf8"), "landed");

            writeVerbatim(absolute, `${BEFORE}another seat's line\n`);
            assert.equal(
                landWitnessed(witnessed, landed, () => retried),
                retried,
            );

            writeVerbatim(absolute, BEFORE.replace("status: before", "status: moved"));
            const contended = landWitnessed(witnessed, landed, () => retried);
            assert.equal(contended.code, 1);
            assert.ok(contended.message.includes("status: moved"));
            assert.ok(readFileSync(absolute, "utf8").includes("status: moved"));
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
