import { afterAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { loadExports } from "@govlab/docs/core/loaders/plugin.loader.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const dir = mkdtempSync(join(tmpdir(), "doc-plugins-"));
writeVerbatim(join(dir, "b.mjs"), 'export const plugin = { name: "b" };\n');
writeVerbatim(join(dir, "a.mjs"), 'export const plugin = { name: "a" };\n');
writeVerbatim(join(dir, "other.mjs"), "export const plugin = 7;\n");
writeVerbatim(join(dir, "notes.txt"), "not a module");

const isNamed = function isNamed(value: unknown): value is { name: string } {
    return typeof value === "object" && value !== null && "name" in value;
};

afterAll(() => {
    rmSync(dir, { force: true, recursive: true });
});

describe("loadExports", () => {
    it("imports each module file in name order and keeps the exports the guard accepts", async () => {
        const plugins = await loadExports(dir, "plugin", isNamed);
        expect(plugins.map((plugin) => plugin.name)).toStrictEqual(["a", "b"]);
        expect(await loadExports(join(dir, "absent"), "plugin", isNamed)).toStrictEqual([]);
    });
});
