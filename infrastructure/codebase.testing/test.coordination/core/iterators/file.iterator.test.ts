import { describe, it } from "vitest";
import { forwardSlashed, readSource, toPosix, walk } from "coordination-surface/tools/core/iterators/file.iterator.ts";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const FILES = ["a.ts", "b.md", "nested/c.ts", "nested/c.test.ts", "node_modules/d.ts"];

const withTree = function withTree(probe: (root: string) => void): void {
    const root = mkdtempSync(resolve(tmpdir(), "file-iterator-"));
    for (const file of FILES) {
        const absolute = resolve(root, file);
        mkdirSync(resolve(absolute, ".."), { recursive: true });
        writeVerbatim(absolute, file);
    }
    try {
        probe(root);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
};

describe("walk", () => {
    it("lists the files under the root with a kept extension, skipping ignored names and excluded suffixes", () => {
        withTree((root) => {
            const found = walk({ excluded: [".test.ts"], extensions: [".ts"], ignored: ["node_modules"], root }).map(
                (path) => toPosix(root, path),
            );
            assert.deepEqual(found, ["a.ts", "nested/c.ts"]);
        });
    });

    it("lists every file when no extension is named", () => {
        withTree((root) => {
            assert.equal(walk({ extensions: [], ignored: [], root }).length, FILES.length);
        });
    });
});

describe("readSource, forwardSlashed and toPosix", () => {
    it("reads a file and reports paths with forward slashes relative to a root", () => {
        withTree((root) => {
            assert.equal(readSource(resolve(root, "b.md")), "b.md");
            assert.equal(toPosix(root, resolve(root, "nested", "c.ts")), "nested/c.ts");
        });
        assert.equal(forwardSlashed(String.raw`tools\core\a.ts`), "tools/core/a.ts");
    });
});
