import { describe, expect, it } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { isPrecompressible, precompressText } from "@banes-lab/build-scripts/core/persistence/text.persistence.ts";
import { brotliDecompressSync } from "node:zlib";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const LARGE = "catalog entry ".repeat(64);

const output = function output(): { cache: string; outDir: string; root: string } {
    const root = mkdtempSync(join(tmpdir(), "brotli-"));
    const outDir = join(root, "web");
    mkdirSync(join(outDir, "json"), { recursive: true });
    writeVerbatim(join(outDir, "json", "a.json"), LARGE);
    writeVerbatim(join(outDir, "page.md"), LARGE);
    writeVerbatim(join(outDir, "page.html"), LARGE);
    writeVerbatim(join(outDir, "tiny.json"), "{}");
    return { cache: join(root, "cache"), outDir, root };
};

describe("isPrecompressible", () => {
    it("takes every text file except a page and a file that already has a brotli sibling", () => {
        const present = new Set(["a.js.br"]);
        expect(isPrecompressible("json/a.json", present)).toBe(true);
        expect(isPrecompressible("page.md", present)).toBe(true);
        expect(isPrecompressible("page.html", present)).toBe(false);
        expect(isPrecompressible("a.js", present)).toBe(false);
        expect(isPrecompressible("hero.png", present)).toBe(false);
    });
});

describe("precompressText", () => {
    it("writes a decodable brotli sibling for each large text file but no page, then reuses the cache", async () => {
        const { cache, outDir, root } = output();
        expect(await precompressText(outDir, cache)).toStrictEqual({ compressed: 1, reused: 1 });
        const sibling = brotliDecompressSync(readFileSync(join(outDir, "json", "a.json.br"))).toString("utf8");
        expect(sibling).toBe(LARGE);
        expect(existsSync(join(outDir, "page.md.br"))).toBe(true);
        expect(existsSync(join(outDir, "page.html.br"))).toBe(false);
        expect(existsSync(join(outDir, "tiny.json.br"))).toBe(false);
        rmSync(join(outDir, "json", "a.json.br"));
        rmSync(join(outDir, "page.md.br"));
        expect(await precompressText(outDir, cache)).toStrictEqual({ compressed: 0, reused: 2 });
        expect(readdirSync(cache)).toHaveLength(1);
        rmSync(root, { force: true, recursive: true });
    });
});
