import {
    CONCERN_MISSING,
    ROLE_EXISTS,
    TEMPLATE_WITHOUT_SECTIONS,
    roleRaised,
} from "coordination-surface/tools/core/strings/role.strings.ts";
import { describe, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { join } from "node:path";
import { runRole } from "coordination-surface/tools/core/runners/role.runner.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const TEMPLATE = ["---", "letter: <LETTER>", "type: ROLE", "---", "# IDENTITY", "## Measured errors"].join("\n");

describe("runRole", () => {
    it("raises a role from the template's fields and sections, and refuses an empty concern, a taken file or a sectionless template", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-role-"));
        try {
            const absolute = join(root, "review.b.role.txt");
            const template = join(root, "role.template.txt");
            const request = { absolute, concern: "review", letter: "B", template };
            assert.deepEqual(runRole({ ...request, concern: " " }), { code: 2, message: CONCERN_MISSING });
            writeVerbatim(template, "---\n---\n");
            assert.deepEqual(runRole(request), { code: 2, message: TEMPLATE_WITHOUT_SECTIONS });
            writeVerbatim(template, TEMPLATE);
            assert.deepEqual(runRole(request), { code: 0, message: roleRaised("B", "review") });
            const raised = readFileSync(absolute, "utf8").split("\n");
            assert.deepEqual(raised.slice(0, 4), ["---", "letter: B", "type: ROLE", "---"]);
            assert.ok(raised.includes("# IDENTITY"));
            assert.deepEqual(runRole(request), { code: 2, message: ROLE_EXISTS });
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
