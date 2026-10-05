import { SNAPSHOT_STEP, retainedFrom } from "coordination-surface/tools/core/readers/snapshot.reader.ts";
import { describe, it } from "vitest";
import { join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { GENERATED_DIR } from "coordination-surface/tools/core/constants/path.constants.ts";
import assert from "node:assert/strict";
import { ruleReportName } from "coordination-surface/tools/core/reporters/rule.reporter.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const withSnapshot = function withSnapshot(text: string | null, check: (root: string) => void): void {
    const root = mkdtempSync(join(tmpdir(), "coordination-snapshot-"));
    try {
        const dir = resolve(root, GENERATED_DIR);
        mkdirSync(dir, { recursive: true });
        if (text !== null) {
            writeVerbatim(join(dir, ruleReportName(SNAPSHOT_STEP)), text);
        }
        check(root);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
};

describe("retainedFrom", () => {
    it("reads the retained extent the last snapshot run published, dropping surfaces of the wrong shape", () => {
        const report = {
            derivations: {
                retainedExtent: {
                    anchorKinds: ["record", 4],
                    range: "all",
                    surfaces: {
                        "a.md": { anchors: ["record:A"], lifetime: "kept", mark: "m" },
                        "b.md": { anchors: "not a list", lifetime: "kept" },
                        "c.md": { anchors: [], lifetime: "kept" },
                    },
                },
            },
        };
        withSnapshot(JSON.stringify(report), (root) => {
            assert.deepEqual(retainedFrom(root), {
                anchorKinds: ["record"],
                range: "all",
                surfaces: {
                    "a.md": { anchors: ["record:A"], lifetime: "kept", mark: "m" },
                    "c.md": { anchors: [], lifetime: "kept", mark: "" },
                },
            });
        });
    });

    it("answers null for no report, a broken one, or one without a retained extent", () => {
        withSnapshot(null, (root) => {
            assert.equal(retainedFrom(root), null);
        });
        withSnapshot("{ broken", (root) => {
            assert.equal(retainedFrom(root), null);
        });
        withSnapshot(JSON.stringify({ derivations: { retainedExtent: { range: 3, surfaces: {} } } }), (root) => {
            assert.equal(retainedFrom(root), null);
        });
    });
});
