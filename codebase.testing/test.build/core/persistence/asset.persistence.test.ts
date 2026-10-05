import { UNREFERENCED, builtOutput } from "./asset.fixture.ts";
import { afterEach, describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { pruneOutput, replaceFolderFiles } from "@banes-lab/build-scripts/core/persistence/asset.persistence.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { unreferencedFiles } from "@banes-lab/build-scripts/core/analyzers/asset.analyzer.ts";

const scratch: string[] = [];

afterEach(() => {
    for (const dir of scratch.splice(0)) {
        rmSync(dir, { force: true, recursive: true });
    }
});

describe("pruneOutput", () => {
    it("deletes exactly the unreferenced files and reports what it removed", () => {
        const outDir = builtOutput();
        scratch.push(outDir);
        const { count } = pruneOutput(outDir);
        expect(count).toBe(UNREFERENCED.length);
        expect(existsSync(join(outDir, "assets", "orphan.mp4"))).toBe(false);
        expect(existsSync(join(outDir, "assets", "app.js.gz"))).toBe(true);
        expect(unreferencedFiles(outDir)).toStrictEqual([]);
    });
});

describe("replaceFolderFiles", () => {
    it("writes the given files, removes the stale ones and keeps the folder itself", () => {
        const root = mkdtempSync(join(tmpdir(), "asset-folder-"));
        scratch.push(root);
        const dir = join(root, "assets");
        replaceFolderFiles(
            dir,
            new Map([
                ["a.txt", "a"],
                ["b.txt", "b"],
            ]),
        );
        replaceFolderFiles(
            dir,
            new Map([
                ["b.txt", "b2"],
                ["c.txt", "c"],
            ]),
        );
        expect(existsSync(dir)).toBe(true);
        expect(readdirSync(dir).sort((x, y) => x.localeCompare(y))).toStrictEqual(["b.txt", "c.txt"]);
        expect(readFileSync(join(dir, "b.txt"), "utf8")).toBe("b2");
    });
});
