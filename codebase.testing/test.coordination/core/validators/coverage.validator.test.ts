import {
    UNBUILT_HALF,
    checkableHalves,
    inspectDigests,
    rosterRows,
} from "coordination-surface/tools/core/validators/coverage.validator.ts";
import { describe, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const ONE_WRITER = "one-writer";

const REGISTRY = [
    "| slug | question | observer |",
    `| \`${ONE_WRITER}\` | who writes | \`board\` |`,
    "| `unbuilt` | who checks | none |",
    "| `prose` | why | a person reads it |",
    "| not a slug | x | y |",
].join("\n");

describe("rosterRows and checkableHalves", () => {
    it("read each roster row by its backticked slug and last value, and select the halves a gate or the unbuilt mark observes", () => {
        assert.deepEqual(
            rosterRows(REGISTRY).map((row) => [row.slug, row.cell, row.line]),
            [
                [ONE_WRITER, "board", 2],
                ["unbuilt", UNBUILT_HALF, 3],
                ["prose", "a person reads it", 4],
            ],
        );
        assert.deepEqual(checkableHalves(REGISTRY, new Set(["board"])), [
            { gate: "board", line: 2, slug: ONE_WRITER },
            { gate: UNBUILT_HALF, line: 3, slug: "unbuilt" },
        ]);
    });
});

describe("inspectDigests", () => {
    it("report a gate declared inside a digest and an expansion nothing declares, and strip the declarations when healing", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-digests-"));
        try {
            const digest = "digest.rule.md";
            writeVerbatim(
                join(root, digest),
                `## \`${ONE_WRITER}\`\n- \`${ONE_WRITER}\` · gate: board\n## \`ghost\`\n`,
            );
            const report = inspectDigests(root, [digest, "absent.md"], new Set([ONE_WRITER]), false);
            assert.deepEqual(
                report.findings.map((finding) => [finding.rule, finding.locus]),
                [
                    ["coverage/digestDeclares", ONE_WRITER],
                    ["coverage/undeclaredExpansion", "ghost"],
                ],
            );
            assert.deepEqual(
                report.expanded.map((entry) => entry.slug),
                [ONE_WRITER, "ghost"],
            );
            const healed = inspectDigests(root, [digest], new Set([ONE_WRITER, "ghost"]), true);
            assert.equal(healed.healed.length, 1);
            assert.ok(!readFileSync(join(root, digest), "utf8").includes("gate:"));
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
