import {
    NO_CATALOG_SITEMAP,
    strayInSitemap,
    unlistedInSitemap,
} from "@banes-lab/build-scripts/configuration/strings/catalog.strings.ts";
import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { mkdtempSync } from "node:fs";
import { sitemapFindings } from "@banes-lab/build-scripts/core/validators/catalog.location.validator.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const SITE = "https://x.test";
const SITEMAP = "sitemap-catalog.xml";

const outWith = function outWith(locations: readonly string[]): string {
    const outDir = mkdtempSync(join(tmpdir(), "catalog-sitemap-"));
    const body = locations.map((location) => `<url><loc>${SITE}${location}</loc></url>`).join("");
    writeVerbatim(join(outDir, SITEMAP), `<urlset>${body}</urlset>`);
    return outDir;
};

describe("sitemapFindings", () => {
    it("refuses a build with no catalog sitemap", () => {
        expect(sitemapFindings("/nowhere", SITE, [], new Set())).toStrictEqual([
            { file: SITEMAP, message: NO_CATALOG_SITEMAP },
        ]);
    });

    it("reports a Markdown leaf the sitemap does not list and a listed address that is no leaf", () => {
        const outDir = outWith(["/api/a.md", "/api/stray.md"]);
        expect(sitemapFindings(outDir, SITE, ["api/a.md", "api/b.md"], new Set([SITEMAP]))).toStrictEqual([
            { file: SITEMAP, message: unlistedInSitemap("api/b.md") },
            { file: SITEMAP, message: strayInSitemap("api/stray.md") },
        ]);
    });
});
