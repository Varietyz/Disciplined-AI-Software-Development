import {
    SUBJECT_MISSING,
    contractBlockMissing,
    subjectUndeclared,
    surfaceExists,
    surfaceRaised,
    surfaceRehearsed,
    templateFileMissing,
    templateSeedsNothing,
} from "coordination-surface/tools/core/strings/surface.strings.ts";
import {
    declaredSubjects,
    raisedFrom,
    runSurfaceRaise,
} from "coordination-surface/tools/core/runners/surface.runner.ts";
import { describe, it } from "vitest";
import { dirname, join, resolve } from "node:path";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { surfacePath } from "coordination-surface/config/surface.config.ts";
import { taxonomy } from "coordination-surface/config/taxonomy.config.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const SLOT = "model_template";

describe("declaredSubjects and raisedFrom", () => {
    it("read the taxonomy's subjects, and carry a template from its first banner up to its live section", () => {
        assert.deepEqual(declaredSubjects(), taxonomy.subjects);
        const template = [
            "intro",
            "═══ CONTRACT ═══",
            "body",
            "**A surface raised from this template keeps",
            "live",
        ].join("\n");
        assert.equal(raisedFrom(template), "═══ CONTRACT ═══\nbody\n");
        assert.equal(raisedFrom("no banner"), "\n");
    });
});

describe("runSurfaceRaise", () => {
    it("raises a surface from its seeding template, rehearses without writing, and refuses what it cannot raise", () => {
        const repoRoot = mkdtempSync(join(tmpdir(), "coordination-surface-raise-"));
        try {
            const subject = declaredSubjects()[0] ?? "";
            const request = {
                concern: "model",
                rehearse: false,
                repoRoot,
                rootSlot: "models",
                subject,
                templateSlot: SLOT,
            };
            const target = `${surfacePath("models")}/${subject}.model.md`;
            assert.deepEqual(runSurfaceRaise({ ...request, subject: " " }), { code: 2, message: SUBJECT_MISSING });
            assert.deepEqual(runSurfaceRaise({ ...request, subject: "undeclared-probe" }), {
                code: 2,
                message: subjectUndeclared("undeclared-probe", declaredSubjects()),
            });
            assert.deepEqual(runSurfaceRaise({ ...request, templateSlot: "binding" }), {
                code: 2,
                message: templateSeedsNothing("binding"),
            });
            assert.deepEqual(runSurfaceRaise(request), { code: 2, message: templateFileMissing(SLOT) });
            const template = resolve(repoRoot, surfacePath(SLOT));
            mkdirSync(dirname(template), { recursive: true });
            writeVerbatim(template, "intro only\n");
            assert.deepEqual(runSurfaceRaise(request), { code: 2, message: contractBlockMissing(SLOT) });
            writeVerbatim(template, "intro\n═══ CONTRACT ═══\nbody\n");
            assert.deepEqual(runSurfaceRaise({ ...request, rehearse: true }), {
                code: 0,
                message: surfaceRehearsed(target, SLOT),
            });
            assert.equal(existsSync(resolve(repoRoot, target)), false);
            assert.deepEqual(runSurfaceRaise(request), { code: 0, message: surfaceRaised(target, SLOT) });
            assert.deepEqual(runSurfaceRaise(request), { code: 2, message: surfaceExists(target) });
        } finally {
            rmSync(repoRoot, { force: true, recursive: true });
        }
    });
});
