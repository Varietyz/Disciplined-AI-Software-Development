import { afterAll, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { inspectPackage } from "@govlab/docs/core/analyzers/package.analyzer.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const root = mkdtempSync(join(tmpdir(), "doc-inspect-"));
const pkg = join(root, "tools", "mod");
mkdirSync(pkg, { recursive: true });
writeVerbatim(
    join(pkg, "package.json"),
    JSON.stringify({
        dependencies: { "@govlab/constants": "*", zod: "1" },
        description: "A mod.",
        name: "@govlab/mod",
    }),
);
writeVerbatim(join(pkg, "README.md"), "# Mod\n\n## What is it\n\nDoes one\nthing.\n\n## Next\n");
writeVerbatim(join(pkg, "index.ts"), "export const a = 1;\nexport const b = 2;\n");
writeVerbatim(join(pkg, "a.ts"), "const x = 1;\n");

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("inspectPackage", () => {
    it("reads a package's identity, purpose, dependencies, barrel and source size", () => {
        const info = inspectPackage(pkg, { group: "tools", packageName: "mod", repoRoot: root });
        expect(info).toMatchObject({
            barrelExports: 2,
            description: "A mod.",
            externalDeps: ["zod"],
            group: "tools",
            hasReadme: true,
            name: "@govlab/mod",
            path: "tools/mod",
            purpose: "Does one thing.",
            siblingDeps: ["@govlab/constants"],
            slug: "mod",
            sourceFiles: 1,
            version: "0.0.0",
        });
    });

    it("skips a folder without a named package", () => {
        expect(inspectPackage(root, { group: "tools", packageName: "none", repoRoot: root })).toBeNull();
    });
});
