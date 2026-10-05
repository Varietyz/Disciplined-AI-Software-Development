import { describe, expect, it } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { syncFolder } from "@banes-lab/build-scripts/core/persistence/folder.persistence.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const CHANGED = "changed.txt";

const tree = function tree(): { from: string; root: string; to: string } {
    const root = mkdtempSync(join(tmpdir(), "folder-sync-"));
    const from = join(root, "from");
    const to = join(root, "to");
    mkdirSync(join(from, "nested"), { recursive: true });
    mkdirSync(join(to, "gone"), { recursive: true });
    writeVerbatim(join(from, "nested", "kept.txt"), "kept");
    writeVerbatim(join(from, CHANGED), "new");
    writeVerbatim(join(from, "skipped.txt"), "skipped");
    writeVerbatim(join(to, CHANGED), "old");
    writeVerbatim(join(to, "gone", "stale.txt"), "stale");
    return { from, root, to };
};

describe("syncFolder", () => {
    it("copies new and changed files, removes stale ones and their emptied folders, and honors the admit filter", async () => {
        const { from, root, to } = tree();
        const sync = await syncFolder(from, to, (path) => !path.endsWith("skipped.txt"));
        expect(sync).toStrictEqual({ copied: 2, removed: 1 });
        expect(readFileSync(join(to, "nested", "kept.txt"), "utf8")).toBe("kept");
        expect(readFileSync(join(to, CHANGED), "utf8")).toBe("new");
        expect(existsSync(join(to, "skipped.txt"))).toBe(false);
        expect(existsSync(join(to, "gone"))).toBe(false);
        rmSync(root, { force: true, recursive: true });
    });

    it("leaves an unchanged file untouched on a second run", async () => {
        const { from, root, to } = tree();
        await syncFolder(from, to);
        const before = statSync(join(to, CHANGED)).mtimeMs;
        const again = await syncFolder(from, to);
        const after = statSync(join(to, CHANGED)).mtimeMs;
        rmSync(root, { force: true, recursive: true });
        expect(again).toStrictEqual({ copied: 0, removed: 0 });
        expect(after).toBe(before);
    });
});
