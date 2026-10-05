import type { AnatomyFile, AnatomyFolder } from "@banes-lab/web/types/anatomy.types.js";
import { describe, expect, it } from "vitest";
import { holdsFiles } from "@banes-lab/build-scripts/core/predicates/folder.predicate.ts";

const STATS = {
    bytes: 0,
    callable: 0,
    definitions: 0,
    edges: 0,
    exported: 0,
    files: 0,
    findings: {},
    flows: {},
    lines: { blank: 0, code: 0, total: 0 },
};

const file: AnatomyFile = {
    definitions: [],
    distribution: { invariants: [], variants: [] },
    document: null,
    findings: [],
    generated: false,
    id: "a/b/c.ts",
    inherited: false,
    layer: null,
    name: "c.ts",
    path: "a/b/c.ts",
    slots: null,
    source: "",
    stats: STATS,
    walk: null,
};

const folder = function folder(path: string, files: readonly AnatomyFile[], folders: readonly AnatomyFolder[]): AnatomyFolder {
    return { files, findings: [], folders, id: path, layer: null, name: path, path, role: "member", stats: STATS, walk: null };
};

describe("holdsFiles", () => {
    it("holds a folder with a file at any depth, and refuses an empty folder or a chain of empty ones", () => {
        expect(holdsFiles(folder("a", [], []))).toBe(false);
        expect(holdsFiles(folder("a", [], [folder("a/b", [], [])]))).toBe(false);
        expect(holdsFiles(folder("a/b", [file], []))).toBe(true);
        expect(holdsFiles(folder("a", [], [folder("a/b", [file], [])]))).toBe(true);
    });
});
