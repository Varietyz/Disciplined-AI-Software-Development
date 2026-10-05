import { ROOT, relativePath } from "@ssot/paths";
import { delegatedRoots, docsHostFor } from "@govlab/docs/core/factories/environment.factory.ts";
import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("docsHostFor", () => {
    it("assembles the validation context from the workspace root", async () => {
        const host = await docsHostFor(ROOT);
        expect(host.ctx.root).toBe(host.root);
        expect(host.rootPrefix).toBe(`${relativePath("docArch")}/`);
        expect(host.walk(host.root, ".md").length).toBeGreaterThan(0);
        expect(host.relative(join(ROOT, "a", "b.md"))).toBe("a/b.md");
    });
});

describe("delegatedRoots", () => {
    it("names only the modules whose manifest declares its own governance", () => {
        const root = mkdtempSync(join(tmpdir(), "delegated-roots-"));
        try {
            const shaped = { label: "module", maturity: "stable", visibility: {} };
            const manifests = {
                governed: { ...shaped },
                owner: { ...shaped, selfGoverned: { checker: "c", paths: "p" } },
            };
            for (const [name, manifest] of Object.entries(manifests)) {
                mkdirSync(join(root, name));
                writeVerbatim(join(root, name, "_manifest.json"), JSON.stringify(manifest));
            }
            expect(delegatedRoots(root)).toStrictEqual(["owner/"]);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
