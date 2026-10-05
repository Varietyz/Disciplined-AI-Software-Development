import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { join, relative } from "node:path";
import { mkdirSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { captureOutput } from "./output.fixture.ts";
import { runCatalog } from "@govlab/docs/core/coordinators/catalog.coordinator.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const root = mkdtempSync(join(tmpdir(), "doc-catalog-run-"));
const indexDir = join(root, "index");
mkdirSync(join(root, "docs"), { recursive: true });
mkdirSync(indexDir, { recursive: true });
const DOC = join(root, "docs", "a.md");
writeVerbatim(DOC, "---\nname: a\ntype: guide\nconcern: scaling\nsummary: A.\nstatus: current\n---\n# A\n");
writeVerbatim(join(indexDir, "gone.generated.md"), "stale");

afterEach(() => {
    vi.restoreAllMocks();
});

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("runCatalog", () => {
    it("writes the catalog and one barrel per concern, prunes stale barrels and reports the totals", async () => {
        const output = captureOutput();
        const context = {
            docs: [DOC],
            relative: (doc: string) => relative(root, doc).split("\\").join("/"),
            root,
            rootPrefix: "docs/",
        };
        await runCatalog(context, indexDir);
        expect(readdirSync(indexDir).toSorted((left, right) => left.localeCompare(right))).toStrictEqual([
            "catalog.generated.json",
            "scaling.generated.md",
        ]);
        expect(output.out.join("")).toContain("1 doc(s), 1 concern barrel(s)");
        expect(output.out.join("")).toContain("1 pruned");
    });
});
