import {
    RAISE_AGENDA_MISSING,
    RAISE_NOTHING_ADMISSIBLE,
    raiseRefused,
} from "coordination-surface/tools/core/strings/venue.strings.ts";
import { describe, it } from "vitest";
import { dirname, join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { AGENDA } from "coordination-surface/tools/core/constants/blocking.constants.ts";
import assert from "node:assert/strict";
import { raisePlan } from "coordination-surface/tools/core/inspectors/venue.inspector.ts";
import { surfacePrefix } from "coordination-surface/config/surface.config.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("raisePlan", () => {
    it("refuses a raise with no agenda, and one whose agenda holds no admissible invariant", () => {
        const repoRoot = mkdtempSync(join(tmpdir(), "coordination-raise-"));
        try {
            const request = { declared: null, repoRoot, seats: [] };
            assert.deepEqual(raisePlan(request), {
                code: 2,
                message: raiseRefused(RAISE_AGENDA_MISSING),
                raised: null,
            });
            mkdirSync(resolve(repoRoot, surfacePrefix()), { recursive: true });
            mkdirSync(dirname(resolve(repoRoot, AGENDA)), { recursive: true });
            writeVerbatim(resolve(repoRoot, AGENDA), "");
            assert.deepEqual(raisePlan(request), {
                code: 2,
                message: raiseRefused(RAISE_NOTHING_ADMISSIBLE),
                raised: null,
            });
        } finally {
            rmSync(repoRoot, { force: true, recursive: true });
        }
    });
});
