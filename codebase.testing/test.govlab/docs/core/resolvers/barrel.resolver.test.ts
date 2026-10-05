import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { resolveSourceBarrels } from "@govlab/docs/core/resolvers/barrel.resolver.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const withTree = function withTree(files: Record<string, string>, run: (dir: string) => void): void {
    const dir = mkdtempSync(join(tmpdir(), "doc-barrels-"));
    try {
        for (const [rel, body] of Object.entries(files)) {
            mkdirSync(join(dir, ...rel.split("/").slice(0, -1)), { recursive: true });
            writeVerbatim(join(dir, ...rel.split("/")), body);
        }
        run(dir);
    } finally {
        rmSync(dir, { force: true, recursive: true });
    }
};

const barrelTails = function barrelTails(dir: string, pkg: Record<string, unknown>): string[] {
    return resolveSourceBarrels(dir, pkg).map((entry) =>
        entry.barrel
            .slice(dir.length + 1)
            .split("\\")
            .join("/"),
    );
};

describe("resolveSourceBarrels", () => {
    it("expands a wildcard export into its entry files and sub-barrels", () => {
        withTree({ "alpha/index.ts": "", "beta/index.ts": "", "index.ts": "" }, (dir) => {
            expect(barrelTails(dir, { exports: { "./*": "./*" } })).toStrictEqual([
                "alpha/index.ts",
                "beta/index.ts",
                "index.ts",
            ]);
        });
    });

    it("maps a built export back to its source and falls back to a conventional entry", () => {
        withTree({ "src/main.ts": "" }, (dir) => {
            expect(barrelTails(dir, { main: "dist/main.js" })).toStrictEqual(["src/main.ts"]);
            expect(barrelTails(dir, {})).toStrictEqual(["src/main.ts"]);
        });
    });

    it("resolves one barrel per frontend and backend axis", () => {
        withTree({ "backend/index.ts": "", "frontend/index.ts": "" }, (dir) => {
            const axes = resolveSourceBarrels(dir, {
                exports: { "./backend": "./backend/index.ts", "./frontend": "./frontend/index.ts" },
            });
            expect(axes.map((entry) => entry.axis)).toStrictEqual(["frontend", "backend"]);
        });
    });
});
