import { describe, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { join } from "node:path";
import { loadTaxonomy } from "coordination-surface/tools/core/resolvers/taxonomy.resolver.ts";
import { resolveArtifactRoots } from "coordination-surface/tools/core/resolvers/artifact.resolver.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const REASONS = ["does not exist", "not valid JSON", "absent or not a string", "outside the repository"];

const rootsFor = function rootsFor(
    repoRoot: string,
    artifactRoots: Parameters<typeof resolveArtifactRoots>[1]["artifactRoots"],
): ReturnType<typeof resolveArtifactRoots> {
    return resolveArtifactRoots(repoRoot, { ...loadTaxonomy(), artifactRoots });
};

describe("resolveArtifactRoots", () => {
    it("resolves each subtree under the path its binding names, and refuses every way the binding can fail", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-artifacts-"));
        try {
            writeVerbatim(join(root, "bind.json"), JSON.stringify({ paths: { history: "store", out: "../away" } }));
            writeVerbatim(join(root, "broken.json"), "{ not json");
            mkdirSync(join(root, "store", "kept"), { recursive: true });
            const resolved = rootsFor(root, {
                history: { binding: "bind.json", field: ["paths", "history"], subtrees: ["kept", "gone"] },
            });
            assert.deepEqual(
                resolved.map((entry) => [entry.path, entry.unresolved]),
                [
                    ["store/kept", null],
                    ["", "subtree store/gone does not exist"],
                ],
            );
            const refused = rootsFor(root, {
                absent: { binding: "missing.json", field: ["x"], subtrees: ["a"] },
                broken: { binding: "broken.json", field: ["x"], subtrees: ["a"] },
                field: { binding: "bind.json", field: ["paths", "none"], subtrees: ["a"] },
                outside: { binding: "bind.json", field: ["paths", "out"], subtrees: ["a"] },
            });
            assert.equal(refused.length, 4);
            assert.ok(refused.every((entry) => entry.unresolved !== null && entry.path === ""));
            assert.deepEqual(
                refused.map((entry, at) => entry.unresolved?.includes(REASONS[at] ?? "")),
                [true, true, true, true],
            );
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
