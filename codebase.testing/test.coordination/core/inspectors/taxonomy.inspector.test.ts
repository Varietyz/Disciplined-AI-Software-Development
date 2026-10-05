import { describe, it } from "vitest";
import { foreignMarkerIn, isDirectory } from "coordination-surface/tools/core/inspectors/taxonomy.inspector.ts";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const SCOPE = {
    foreignGrammar: {
        groupingDelimiters: [
            ["(", ")"],
            ["", "]"],
        ],
        ownershipManifests: ["package.json"],
    },
    ignored: ["node_modules"],
};

const grown = function grown(paths: readonly string[]): string {
    const root = mkdtempSync(resolve(tmpdir(), "taxonomy-inspector-"));
    for (const path of paths) {
        const absolute = resolve(root, path);
        mkdirSync(resolve(absolute, ".."), { recursive: true });
        writeVerbatim(absolute, "");
    }
    return root;
};

const withTree = function withTree(paths: readonly string[], probe: (root: string) => void): void {
    const root = grown(paths);
    try {
        probe(root);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
};

describe("isDirectory", () => {
    it("is true for a folder and false for a file or a missing path", () => {
        withTree(["tools/a.ts"], (root) => {
            assert.equal(isDirectory(root, "tools"), true);
            assert.equal(isDirectory(root, "tools/a.ts"), false);
            assert.equal(isDirectory(root, "missing"), false);
        });
    });
});

describe("foreignMarkerIn", () => {
    it("finds an ownership manifest below the root", () => {
        withTree(["tools/core/nested/package.json"], (root) => {
            assert.deepEqual(foreignMarkerIn(root, "tools", SCOPE)?.evidence, "tools/core/nested/package.json");
        });
    });

    it("finds a grouping folder of another grammar", () => {
        withTree(["tools/(group)/a.ts"], (root) => {
            assert.deepEqual(foreignMarkerIn(root, "tools", SCOPE)?.evidence, "tools/(group)");
        });
    });

    it("skips ignored folders and a pair with an empty delimiter, and finds nothing in a clean tree", () => {
        withTree(["tools/node_modules/package.json", "tools/core/list]/a.ts"], (root) => {
            assert.equal(foreignMarkerIn(root, "tools", SCOPE), null);
        });
    });
});
