import { afterAll, expect, test } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import {
    readFileSafe,
    readJsonField,
    readJsonFile,
    safeReaddir,
    safeStat,
    walkFiles,
} from "@govlab/quality/core/loaders/source.loader.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const dir = mkdtempSync(join(tmpdir(), "source-loader-"));
const JSON_FILE = join(dir, "manifest.json");
const TEXT_FILE = join(dir, "note.txt");
writeVerbatim(JSON_FILE, JSON.stringify({ name: "demo" }));
writeVerbatim(TEXT_FILE, "hello");

afterAll(() => {
    rmSync(dir, { force: true, recursive: true });
});

test("readFileSafe reads a file and answers empty text for a missing one", () => {
    expect(readFileSafe(TEXT_FILE)).toBe("hello");
    expect(readFileSafe(join(dir, "missing.txt"))).toBe("");
});

test("safeReaddir lists a folder and answers nothing for a missing one", () => {
    expect(
        safeReaddir(dir)
            .map((entry) => entry.name)
            .sort(),
    ).toStrictEqual(["manifest.json", "note.txt"]);
    expect(safeReaddir(join(dir, "absent"))).toStrictEqual([]);
});

test("readJsonField reads one key of a JSON file, answers undefined for a missing file and throws on malformed JSON", () => {
    expect(readJsonField(JSON_FILE, "name")).toBe("demo");
    expect(readJsonField(join(dir, "absent.json"), "name")).toBeUndefined();
    expect(() => readJsonField(TEXT_FILE, "name")).toThrow(SyntaxError);
});

test("safeStat reads an entry's stats and answers null for a missing one", () => {
    expect(safeStat(dir)?.isDirectory()).toBe(true);
    expect(safeStat(join(dir, "absent"))).toBeNull();
});

test("readJsonFile parses a JSON file and answers undefined for a missing one", () => {
    expect(readJsonFile(JSON_FILE)).toStrictEqual({ name: "demo" });
    expect(readJsonFile(join(dir, "absent.json"))).toBeUndefined();
});

test("walkFiles lists every file below a folder and skips an excluded folder", () => {
    const nested = join(dir, "walk");
    mkdirSync(join(nested, "kept"), { recursive: true });
    mkdirSync(join(nested, "skipped"), { recursive: true });
    writeVerbatim(join(nested, "kept", "a.txt"), "a");
    writeVerbatim(join(nested, "skipped", "b.txt"), "b");
    expect(walkFiles(nested, (full) => full.endsWith("skipped"))).toStrictEqual([join(nested, "kept", "a.txt")]);
});

test("walkFiles skips an excluded file as well as an excluded folder", () => {
    const nested = join(dir, "walk-files");
    mkdirSync(nested, { recursive: true });
    writeVerbatim(join(nested, "kept.ts"), "a");
    writeVerbatim(join(nested, "old.backup.js"), "b");
    expect(walkFiles(nested, (full) => full.endsWith(".backup.js"))).toStrictEqual([join(nested, "kept.ts")]);
});

test("readFileSafe rethrows a failure other than a missing file", () => {
    expect(() => readFileSafe(dir)).toThrow();
});
