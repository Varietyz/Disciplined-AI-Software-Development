import { describe, it } from "vitest";
import { dirname, join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import {
    raiseRefused,
    retireLineMissing,
    retireMissing,
    retireNotPlanning,
    retireNothingDistributed,
    retirePreview,
    retireVenueOpen,
    retired,
    retiredDeclaration,
} from "coordination-surface/tools/core/strings/venue.strings.ts";
import { DISTRIBUTES_FIELD } from "coordination-surface/tools/core/resolvers/converge.resolver.ts";
import assert from "node:assert/strict";
import { runRetire } from "coordination-surface/tools/core/runners/checklist.runner.ts";
import { surfacePath } from "coordination-surface/config/surface.config.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const NAME = "index.checklist.md";

const refused = (reason: string): { code: number; message: string; raised: null } => ({
    code: 2,
    message: raiseRefused(reason),
    raised: null,
});

describe("runRetire", () => {
    it("retires a plan's distribution line once its venue closed, previews without healing, and refuses what it cannot retire", () => {
        const repoRoot = mkdtempSync(join(tmpdir(), "coordination-retire-"));
        try {
            const source = `${surfacePath("planning")}/${NAME}`;
            const absolute = resolve(repoRoot, source);
            const request = { citedBy: ["B", ""], declares: "index", heal: true, live: [], name: NAME, repoRoot };
            assert.deepEqual(runRetire({ ...request, name: "notes.md" }), refused(retireNotPlanning("notes.md")));
            assert.deepEqual(runRetire(request), refused(retireMissing(source)));
            mkdirSync(dirname(absolute), { recursive: true });
            writeVerbatim(absolute, "# Plan\n");
            assert.deepEqual(runRetire({ ...request, declares: "" }), refused(retireNothingDistributed(source)));
            assert.deepEqual(
                runRetire({ ...request, live: ["open/index"] }),
                refused(retireVenueOpen(source, "index")),
            );
            assert.deepEqual(runRetire(request), refused(retireLineMissing(source)));
            writeVerbatim(absolute, `# Plan\n  ${DISTRIBUTES_FIELD} index\n`);
            assert.deepEqual(runRetire({ ...request, heal: false }), {
                code: 0,
                message: retirePreview(source, "index"),
                raised: source,
            });
            assert.deepEqual(runRetire(request), { code: 0, message: retired(source), raised: source });
            assert.equal(readFileSync(absolute, "utf8"), `# Plan\n${retiredDeclaration("  ", ["B"])}\n`);
        } finally {
            rmSync(repoRoot, { force: true, recursive: true });
        }
    });
});
