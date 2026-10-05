import { afterAll, describe, expect, it } from "vitest";
import { basename, join } from "node:path";
import {
    isDirectory,
    readDirSafe,
    readJsonSafe,
    readTextSafe,
    sortedNames,
    walkFiles,
} from "@govlab/docs/core/loaders/base.loader.ts";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const root = mkdtempSync(join(tmpdir(), "doc-base-"));
mkdirSync(join(root, "nested", "skipped"), { recursive: true });
writeVerbatim(join(root, "b.json"), '{ "ok": true }');
writeVerbatim(join(root, "a.txt"), "text");
writeVerbatim(join(root, "broken.json"), "{");
writeVerbatim(join(root, "nested", "c.txt"), "c");
writeVerbatim(join(root, "nested", "skipped", "d.txt"), "d");

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("the safe readers", () => {
    it("read text and JSON, and answer null for a folder, a missing file or broken JSON", () => {
        expect(readTextSafe(join(root, "a.txt"))).toBe("text");
        expect(readTextSafe(root)).toBeNull();
        expect(readJsonSafe(join(root, "b.json"))).toStrictEqual({ ok: true });
        expect(readJsonSafe(join(root, "broken.json"))).toBeNull();
        expect(readJsonSafe(join(root, "absent.json"))).toBeNull();
    });
});

describe("the folder readers", () => {
    it("list a folder sorted, tell a folder from a file, and read nothing from a missing folder", () => {
        expect(isDirectory(root)).toBe(true);
        expect(isDirectory(join(root, "a.txt"))).toBe(false);
        expect(sortedNames(root)).toStrictEqual(["a.txt", "b.json", "broken.json", "nested"]);
        expect(readDirSafe(join(root, "absent"))).toStrictEqual([]);
    });

    it("walk every file below a folder except the excluded folders", () => {
        const names = walkFiles(root, (path) => basename(path) === "skipped").map((path) => basename(path));
        expect(names.toSorted((left, right) => left.localeCompare(right))).toStrictEqual([
            "a.txt",
            "b.json",
            "broken.json",
            "c.txt",
        ]);
    });
});
