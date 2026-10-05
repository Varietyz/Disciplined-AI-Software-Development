import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import {
    packageFiles,
    packagePath,
    populatedFolders,
    shippedEntries,
} from "@banes-lab/content/core/loaders/coordination.loader.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const seeded = function seeded(): string {
    const root = mkdtempSync(join(tmpdir(), "coordination-"));
    mkdirSync(join(root, "roles"));
    mkdirSync(join(root, "findings"));
    mkdirSync(join(root, "node_modules"));
    writeVerbatim(join(root, "package.json"), JSON.stringify({ files: ["README.md", "roles", "findings", "gone.md"] }));
    writeVerbatim(join(root, "README.md"), "a readme\n");
    writeVerbatim(join(root, "roles", ".gitkeep"), "");
    writeVerbatim(join(root, "findings", "a.finding.md"), "a deployment's finding\n");
    writeVerbatim(join(root, "findings", "image.png"), "binary\n");
    writeVerbatim(join(root, "node_modules", "dependency.ts"), "a dependency\n");
    return root;
};

describe("coordination loader", () => {
    it("reads the ship list from the manifest and drops entries that do not exist", () => {
        const root = seeded();
        const entries = shippedEntries(root);
        rmSync(root, { force: true, recursive: true });
        expect(entries).toStrictEqual(["package.json", "README.md", "roles", "findings"]);
    });

    it("walks the text files the package ships and nothing it does not", () => {
        const root = seeded();
        const files = packageFiles(root).map((file) => packagePath(root, file));
        rmSync(root, { force: true, recursive: true });
        expect(files).toStrictEqual(["findings/a.finding.md", "package.json", "README.md"]);
    });

    it("reports a born-empty folder holding more than its keep file", () => {
        const root = seeded();
        const populated = populatedFolders(root);
        rmSync(root, { force: true, recursive: true });
        expect(populated).toStrictEqual(["findings/a.finding.md", "findings/image.png"]);
    });
});
