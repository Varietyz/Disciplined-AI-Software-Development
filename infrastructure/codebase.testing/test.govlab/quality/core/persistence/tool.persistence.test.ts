import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { expect, test } from "vitest";
import {
    freshToolFile,
    readToolReport,
    toolCacheDir,
    toolCacheRelative,
    writeToolFile,
    writeToolJson,
} from "@govlab/quality/core/persistence/tool.persistence.ts";
import path from "node:path";
import { relativePath } from "@ssot/paths";
import { tmpdir } from "node:os";

test("the tool cache writes, reads and clears its files under the declared cache location", async () => {
    const root = mkdtempSync(path.join(tmpdir(), "tool-cache-"));
    try {
        expect(toolCacheDir(root)).toBe(path.join(root, relativePath("toolCache")));
        expect(toolCacheRelative("a.json")).toBe(relativePath("toolCache", "a.json"));
        const text = writeToolFile(root, "a.txt", "hello");
        expect(readToolReport(text)).toBe("hello");
        const json = await writeToolJson(root, "a.json", { key: 1 });
        expect(JSON.parse(readToolReport(json))).toStrictEqual({ key: 1 });
        const fresh = freshToolFile(root, "a.txt");
        expect(existsSync(fresh)).toBe(false);
        expect(readToolReport(fresh)).toBe("");
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
});
