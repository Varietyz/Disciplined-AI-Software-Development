import { NO_CATALOG_SITEMAP, strayInSitemap, unlistedInSitemap } from "#configuration/strings/catalog.strings";
import { fileOfAddress, localAddress } from "#core/resolvers/catalog.resolver";
import { CATALOG_SITEMAP_ROUTE } from "#configuration/constants/site.constants";
import type { Finding } from "#types/validation.types";
import { join } from "node:path";
import { locationsOf } from "#core/converters/build.converter";
import { readFileSync } from "node:fs";
import { sitemapPartFiles } from "#core/resolvers/route.resolver";

export const sitemapFindings = function sitemapFindings(
    outDir: string,
    site: string,
    markdownLeaves: readonly string[],
    present: ReadonlySet<string>,
): Finding[] {
    const file = CATALOG_SITEMAP_ROUTE.slice(1);
    if (!present.has(file)) {
        return [{ file, message: NO_CATALOG_SITEMAP }];
    }
    const parts = sitemapPartFiles(CATALOG_SITEMAP_ROUTE, (held) => present.has(held));
    const locations = parts.flatMap((held) => locationsOf(readFileSync(join(outDir, held), "utf8")));
    const listed = new Set(locations.map((location) => fileOfAddress(localAddress(site, location))));
    const leaves = new Set(markdownLeaves);
    return [
        ...markdownLeaves
            .filter((leaf) => !listed.has(leaf))
            .map((leaf) => ({ file, message: unlistedInSitemap(leaf) })),
        ...[...listed].filter((leaf) => !leaves.has(leaf)).map((leaf) => ({ file, message: strayInSitemap(leaf) })),
    ];
};
