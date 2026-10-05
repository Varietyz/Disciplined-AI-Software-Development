import { BUILTIN_REPRESENTATIONS, loadPlugins } from "@govlab/patterns/core/loaders/representation.loader.ts";
import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";

describe("the representation loader", () => {
    it("loads every built-in representation plugin", () => {
        expect([...BUILTIN_REPRESENTATIONS].sort((a, b) => a.localeCompare(b))).toStrictEqual([
            "distribution",
            "graph",
            "grid",
            "sequence",
            "tree",
            "vector",
        ]);
    });

    it("loads nothing new from a folder without plugins", async () => {
        const empty = mkdtempSync(join(tmpdir(), "pl-plugins-"));
        await expect(loadPlugins(empty)).resolves.toStrictEqual([]);
    });
});
