import { afterAll, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { readdirOrNull, readdirSafe, walkFiles } from "@govlab/stats/core/loaders/folder.loader.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const root = mkdtempSync(join(tmpdir(), "folder-loader-"));
const nested = join(root, "nested");
const file = join(root, "probe.txt");
const missing = join(root, "no-such-entry");

mkdirSync(nested, { recursive: true });
writeVerbatim(file, "text\n");

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("readdirSafe and readdirOrNull", () => {
    it("list entries with their kind", () => {
        const names = readdirSafe(root).map((entry) => `${entry.name}:${entry.isDirectory() ? "dir" : "file"}`);
        expect(names.toSorted((a, b) => a.localeCompare(b))).toStrictEqual(["nested:dir", "probe.txt:file"]);
    });

    it("separate an empty folder from a missing one, and treat a file as no folder", () => {
        expect(readdirSafe(missing)).toStrictEqual([]);
        expect(readdirSafe(file)).toStrictEqual([]);
        expect(readdirOrNull(nested)).toStrictEqual([]);
        expect(readdirOrNull(missing)).toBeNull();
    });
});

describe("walkFiles", () => {
    it("lists every file below a folder, skipping the excluded folders", () => {
        expect(walkFiles(root, () => false)).toStrictEqual([file]);
        expect(walkFiles(root, (path) => path === nested)).toStrictEqual([file]);
        expect(walkFiles(missing, () => false)).toStrictEqual([]);
    });
});
