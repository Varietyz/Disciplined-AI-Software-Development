import type { Finding, Seen } from "#types/validation.types";
import {
    checkEncodings,
    checkIndexable,
    checkLinks,
    checkPage,
    checkSchema,
    checkSitemap,
} from "#core/validators/site.validator";
import { checkFile, isServedUrl } from "#core/validators/build.validator";
import { SITE_URL } from "@banes-lab/web/core/assets/link.assets.ts";
import { SOURCE_SITEMAP_ROUTE } from "#configuration/constants/site.constants";
import { fileForPath } from "#core/resolvers/page.resolver";
import { readArtifact } from "#core/converters/build.converter";
import { readOrNull } from "#core/loaders/build.loader";
import { sitemapPartFiles } from "#core/resolvers/route.resolver";

const SOURCE_SITEMAP_FILE = SOURCE_SITEMAP_ROUTE.slice(1);

const sourcePageFinding = function sourcePageFinding(path: string, served: ReadonlySet<string>, seen: Seen): Finding[] {
    const file = fileForPath(path);
    return checkFile(file, (html) => {
        const artifact = readArtifact(html);
        const address = SITE_URL + path;
        return [
            ...checkPage(file, artifact, address, seen),
            ...checkIndexable(file, artifact, true),
            ...checkSchema(file, artifact, address),
            ...checkEncodings(file, artifact, isServedUrl),
            ...checkLinks(file, artifact, served),
        ];
    });
};

export const sourcePageFindings = function sourcePageFindings(
    sources: readonly string[],
    served: ReadonlySet<string>,
    seen: Seen,
): Finding[] {
    const listed = sources.map((path) => SITE_URL + path);
    const parts = sitemapPartFiles(SOURCE_SITEMAP_ROUTE, (file) => readOrNull(file) !== null);
    return [
        ...sources.flatMap((path) => sourcePageFinding(path, served, seen)),
        ...checkFile(SOURCE_SITEMAP_FILE, () =>
            checkSitemap(SOURCE_SITEMAP_FILE, parts.map((file) => readOrNull(file) ?? "").join("\n"), listed),
        ),
    ];
};
