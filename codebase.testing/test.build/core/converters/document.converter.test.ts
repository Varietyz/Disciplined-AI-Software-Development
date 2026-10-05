import { afterEach, describe, expect, it } from "vitest";
import {
    documentOf,
    documentsOf,
    filesOf,
    isDocument,
} from "@banes-lab/build-scripts/core/converters/document.converter.ts";
import { mkdtempSync, rmSync } from "node:fs";
import { ROOT } from "@ssot/paths";
import { docsHostFor } from "@govlab/docs";
import { join } from "node:path";
import { readDiskFile } from "@banes-lab/build-scripts/core/loaders/structure.loader.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const README = "README.md";
const SOURCE = "# Title\n\nA paragraph that was formerly a note.\n\n```mermaid\nflowchart LR\n```\n";

const scratch: string[] = [];

afterEach(() => {
    for (const dir of scratch.splice(0)) {
        rmSync(dir, { force: true, recursive: true });
    }
});

describe("filesOf and documentsOf", () => {
    it("flattens a tree to its files and derives the coverage facet for every document in it", async () => {
        const dir = mkdtempSync(join(tmpdir(), "anatomy-docs-"));
        scratch.push(dir);
        writeVerbatim(join(dir, README), SOURCE);
        writeVerbatim(join(dir, "a.ts"), "export const a = 1;\n");
        const tree = {
            files: [readDiskFile(join(dir, README), README, README)],
            folders: [
                {
                    files: [readDiskFile(join(dir, "a.ts"), "core/a.ts", "a.ts")],
                    folders: [],
                    name: "core",
                    path: "core",
                    role: "container" as const,
                },
            ],
            name: "",
            path: "",
            role: "member" as const,
        };
        expect(filesOf(tree).map((file) => file.name)).toStrictEqual([README, "a.ts"]);
        const documents = documentsOf(tree, await docsHostFor(ROOT), dir);
        expect([...documents.keys()]).toStrictEqual([README]);
    });
});

describe("isDocument and documentOf", () => {
    it("recognizes markdown by extension and derives the docs coverage facet for it", async () => {
        const dir = mkdtempSync(join(tmpdir(), "anatomy-doc-"));
        scratch.push(dir);
        writeVerbatim(join(dir, README), SOURCE);
        const file = readDiskFile(join(dir, README), README, README);
        expect(isDocument(file)).toBe(true);
        expect(isDocument({ ...file, name: "tsconfig.json" })).toBe(false);
        const host = await docsHostFor(ROOT);
        const document = documentOf(host, dir, file);
        expect(document.headings).toBe(1);
        expect(document.mermaid).toBe(1);
        expect(document.boundary).toBe(true);
        expect(document.form).toBeNull();
        expect(document.findings.some((finding) => finding.code === "history-smell")).toBe(true);
    });
});
