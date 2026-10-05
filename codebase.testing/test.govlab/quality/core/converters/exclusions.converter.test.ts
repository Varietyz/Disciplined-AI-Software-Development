import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { exclusionsFrom } from "@govlab/quality/core/converters/exclusions.converter.ts";
import { getFileInfo } from "prettier";
import os from "node:os";
import path from "node:path";
import { writeVerbatim } from "@govlab/canonical-write";

const REPORTS = "fixture/reports/**";
const ANY_DEPTH = "**/staging/**";
const SEPARATOR = "/";
let root = "";
let base = "";

const ignoredUnder = async function ignoredUnder(patterns: readonly string[], file: string): Promise<boolean> {
    const ignorePath = path.join(base, "ignore");
    writeVerbatim(ignorePath, patterns.join("\n"));
    return (await getFileInfo(path.join(root, file), { ignorePath })).ignored;
};

beforeEach(() => {
    root = mkdtempSync(path.join(os.tmpdir(), "govlab-exclusions-"));
    base = path.join(root, "cache", "tool");
    mkdirSync(base, { recursive: true });
});

afterEach(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("exclusionsFrom", () => {
    it("anchors a root-relative pattern at the root and keeps a pattern that matches at any depth", () => {
        const up = path.relative(base, root).split(path.sep).join(SEPARATOR) + SEPARATOR;
        expect(exclusionsFrom([REPORTS, "/dist", "!/keep/a", ANY_DEPTH, "*.log", "logs/"], base, root)).toStrictEqual([
            up + REPORTS,
            `${up}dist`,
            `!${up}keep/a`,
            up + ANY_DEPTH,
            "*.log",
            "logs/",
        ]);
    });

    it("leaves the patterns unchanged when the ignore file sits at the root", () => {
        expect(exclusionsFrom([REPORTS], root, root)).toStrictEqual([REPORTS]);
    });

    it("makes prettier ignore a root-relative path from an ignore file outside the root, which the raw pattern misses", async () => {
        const report = "fixture/reports/a.json";
        expect(await ignoredUnder([REPORTS], report)).toBe(false);
        expect(await ignoredUnder(exclusionsFrom([REPORTS], base, root), report)).toBe(true);
        expect(await ignoredUnder(exclusionsFrom([REPORTS], base, root), "src/a.json")).toBe(false);
    });
});
