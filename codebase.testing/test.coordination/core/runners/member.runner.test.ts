import { describe, it } from "vitest";
import {
    headingTaken,
    memberAdded,
    regionMissing,
    surfaceMissing,
} from "coordination-surface/tools/core/strings/member.strings.ts";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { join } from "node:path";
import { runMember } from "coordination-surface/tools/core/runners/member.runner.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const TARGET = "roles.txt";

describe("runMember", () => {
    it("appends a member under a new heading, and refuses a missing surface, region or a taken heading", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-member-"));
        try {
            const absolute = join(root, TARGET);
            const request = { absolute, body: "reviews every venue", heading: "review", target: TARGET };
            assert.deepEqual(runMember(request), { code: 2, message: surfaceMissing(TARGET) });
            writeVerbatim(absolute, "# Roles\n");
            assert.deepEqual(runMember(request), { code: 2, message: regionMissing(TARGET) });
            writeVerbatim(absolute, ["═══ ROWS ═══", "## index", "keeps the index"].join("\n"));
            assert.deepEqual(runMember({ ...request, heading: "index" }), {
                code: 2,
                message: headingTaken("index", TARGET),
            });
            assert.deepEqual(runMember(request), { code: 0, message: memberAdded("review", TARGET) });
            assert.ok(readFileSync(absolute, "utf8").includes("## review"));
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
