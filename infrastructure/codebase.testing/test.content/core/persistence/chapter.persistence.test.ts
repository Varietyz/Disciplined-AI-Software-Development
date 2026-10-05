import { describe, expect, it } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readdirSync } from "node:fs";
import { persistChapters, staleChaptersOf } from "@banes-lab/content/core/persistence/chapter.persistence.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const CHAPTERS = [
    { body: "# Home\n", file: "Home.md", label: "Home" },
    { body: "# Start\n", file: "01-Start.md", label: "Start" },
    { body: "# Guide\n", file: "pag/GUIDE.md", label: "Guide" },
];

const seeded = function seeded(): string {
    const out = mkdtempSync(join(tmpdir(), "chapters-"));
    mkdirSync(join(out, "pag"));
    mkdirSync(join(out, "kept"));
    writeVerbatim(join(out, "Old.md"), "old");
    writeVerbatim(join(out, "LICENSE"), "license");
    writeVerbatim(join(out, "Home.md"), "stale home");
    writeVerbatim(join(out, "pag", "OLD.md"), "old");
    writeVerbatim(join(out, "kept", "KEPT.md"), "kept");
    return out;
};

describe("staleChaptersOf", () => {
    it("names every Markdown file the render does not own in the folders it writes, and nothing outside them", () => {
        expect(staleChaptersOf(seeded(), CHAPTERS)).toStrictEqual(["Old.md", "pag/OLD.md"]);
        const missing = join(tmpdir(), "missing-chapters");
        expect(staleChaptersOf(missing, CHAPTERS)).toStrictEqual([]);
    });
});

describe("persistChapters", () => {
    it("removes the stale files, keeps the rest and writes every chapter", async () => {
        const out = seeded();
        const removed = await persistChapters(out, CHAPTERS);
        expect(removed).toStrictEqual(["Old.md", "pag/OLD.md"]);
        expect(existsSync(join(out, "Old.md"))).toBe(false);
        expect(readdirSync(out).sort()).toStrictEqual(["01-Start.md", "Home.md", "LICENSE", "kept", "pag"]);
        expect(readdirSync(join(out, "pag"))).toStrictEqual(["GUIDE.md"]);
        expect(readdirSync(join(out, "kept"))).toStrictEqual(["KEPT.md"]);
    });
});
