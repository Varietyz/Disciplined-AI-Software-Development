import { describe, expect, it } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { persistTreeDeclarations, publishTree } from "@banes-lab/build-scripts/core/persistence/tree.persistence.ts";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";
import { treeDeclarations } from "@banes-lab/build-scripts/core/loaders/tree.loader.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("publishTree", () => {
    it("copies exactly the published files and removes what the tree no longer publishes", async () => {
        const root = mkdtempSync(join(tmpdir(), "publish-tree-"));
        const from = join(root, "member");
        const to = join(root, "published");
        try {
            mkdirSync(join(from, "core", "loaders"), { recursive: true });
            mkdirSync(join(from, "cards"), { recursive: true });
            writeVerbatim(join(from, "package.json"), "{}\n");
            writeVerbatim(join(from, "core", "loaders", "a.loader.ts"), "export {};\n");
            writeVerbatim(join(from, "cards", "home.png"), "binary\n");
            mkdirSync(join(to, "old"), { recursive: true });
            writeVerbatim(join(to, "old", "gone.ts"), "export {};\n");
            const sync = await publishTree(from, to, ["package.json", "core/loaders/a.loader.ts"]);
            expect(sync).toStrictEqual({ copied: 2, removed: 1 });
            expect(existsSync(join(to, "core", "loaders", "a.loader.ts"))).toBe(true);
            expect(existsSync(join(to, "cards"))).toBe(false);
            expect(existsSync(join(to, "old"))).toBe(false);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });

    it("fails when a file the tree links is missing from the checkout after the sync", async () => {
        const root = mkdtempSync(join(tmpdir(), "publish-missing-"));
        try {
            mkdirSync(join(root, "member"), { recursive: true });
            await expect(publishTree(join(root, "member"), join(root, "out"), ["absent.ts"])).rejects.toThrow(
                "absent.ts",
            );
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});

describe("persistTreeDeclarations", () => {
    it("writes the declarations to the generated module the page reads", async () => {
        const declarations = treeDeclarations();
        await persistTreeDeclarations(declarations);
        const text = readFileSync(absolutePath("app.anatomyTrees"), "utf8");
        expect(declarations.every((declaration) => text.includes(declaration.exportName))).toBe(true);
    });
});
