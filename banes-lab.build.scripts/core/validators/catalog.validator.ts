import {
    API_SEGMENT,
    CATALOG_FILE_BUDGET,
    RESOLVE_SEGMENT,
    SOURCE_SEGMENT,
    TEXT_EXTENSION,
} from "#configuration/constants/catalog.constants";
import { JSON_ROUTE, MARKDOWN_EXTENSION } from "#configuration/constants/site.constants";
import {
    NO_ID_MANIFEST,
    UNLISTED_LEAF,
    missingLeaf,
    missingMarkdownLeaf,
    overBudget,
    staleLeaf,
    unservedAddress,
} from "#configuration/strings/catalog.strings";
import { columnValues, rowsOf, shardFilesOf, stringsIn } from "#core/selectors/catalog.selector";
import {
    fileOfAddress,
    idsIndex,
    localAddress,
    movedIndex,
    resolveMap,
    siteIndex,
} from "#core/resolvers/catalog.resolver";
import { readFileSync, statSync } from "node:fs";
import { Buffer } from "node:buffer";
import type { Finding } from "#types/validation.types";
import type { ManifestRow } from "#types/catalog.types";
import { digestOf } from "@govlab/content-fingerprint";
import { isFileRoute } from "#core/predicates/route.predicate";
import { join } from "node:path";
import { sitemapFindings } from "#core/validators/catalog.location.validator";
import { walk } from "#core/loaders/asset.loader";
import { walkFindings } from "#core/validators/catalog.walk.validator";

const FRAGMENT = "#";
const SLASH = "/";
const JSON_EXTENSION = ".json";
const RESOLVE_FOLDERS = [JSON_ROUTE.slice(1), ""].map((root) => root + API_SEGMENT + SLASH + RESOLVE_SEGMENT + SLASH);

const textAt = function textAt(outDir: string, file: string): string {
    return readFileSync(join(outDir, file), "utf8");
};

const jsonAt = function jsonAt(outDir: string, file: string): unknown {
    return JSON.parse(textAt(outDir, file));
};

const targetFile = function targetFile(path: string): string | null {
    if (path.includes(FRAGMENT)) {
        return null;
    }
    if (path.startsWith(JSON_ROUTE) || path.endsWith(MARKDOWN_EXTENSION) || path.endsWith(TEXT_EXTENSION)) {
        return fileOfAddress(path);
    }
    return isFileRoute(path) ? path.slice(1) : null;
};

const rowFindings = function rowFindings(
    outDir: string,
    site: string,
    row: ManifestRow,
    present: ReadonlySet<string>,
): Finding[] {
    const file = fileOfAddress(localAddress(site, row.json));
    if (!present.has(file)) {
        return [{ file, message: missingLeaf(row.ref) }];
    }
    const text = textAt(outDir, file);
    const findings: Finding[] = [];
    if (Buffer.byteLength(text) !== row.bytes || digestOf(text) !== row.fingerprint) {
        findings.push({ file, message: staleLeaf(row.ref) });
    }
    const markdown = row.markdown === null ? null : fileOfAddress(localAddress(site, row.markdown));
    if (markdown !== null && !present.has(markdown)) {
        findings.push({ file: markdown, message: missingMarkdownLeaf(row.ref) });
    }
    return findings;
};

const MOVED_TARGET_COLUMN = "to";

const linkedStrings = function linkedStrings(outDir: string, file: string): readonly string[] {
    if (file === fileOfAddress(movedIndex().json)) {
        return columnValues(textAt(outDir, file), MOVED_TARGET_COLUMN).filter((value) => typeof value === "string");
    }
    return stringsIn(jsonAt(outDir, file));
};

const danglingIn = function danglingIn(
    outDir: string,
    site: string,
    file: string,
    present: ReadonlySet<string>,
): Finding[] {
    return linkedStrings(outDir, file)
        .filter((value) => value.startsWith(site + SLASH))
        .flatMap((value) => {
            const target = targetFile(localAddress(site, value));
            return target === null || present.has(target) ? [] : [{ file, message: unservedAddress(value) }];
        });
};

const markdownTwin = function markdownTwin(file: string): string {
    return file.slice(JSON_ROUTE.length - 1, -JSON_EXTENSION.length) + MARKDOWN_EXTENSION;
};

const isCatalogFile = function isCatalogFile(file: string): boolean {
    if (isFileRoute(SLASH + file)) {
        return false;
    }
    const payload = file.startsWith(JSON_ROUTE.slice(1)) && file.endsWith(JSON_EXTENSION);
    return payload || file.endsWith(MARKDOWN_EXTENSION) || isSourceText(file);
};

const isSourceText = function isSourceText(file: string): boolean {
    return file.startsWith(SOURCE_SEGMENT + SLASH) && file.endsWith(TEXT_EXTENSION);
};

const textsNamedIn = function textsNamedIn(outDir: string, site: string, files: readonly string[]): readonly string[] {
    return files.flatMap((file) =>
        stringsIn(jsonAt(outDir, file)).flatMap((value) => {
            const local = localAddress(site, value);
            return value.startsWith(site + SLASH) && local.endsWith(TEXT_EXTENSION) ? [fileOfAddress(local)] : [];
        }),
    );
};

const budgetFindings = function budgetFindings(outDir: string, files: readonly string[]): Finding[] {
    return files.flatMap((file) => {
        const bytes = statSync(join(outDir, file)).size;
        return bytes > CATALOG_FILE_BUDGET ? [{ file, message: overBudget(bytes, CATALOG_FILE_BUDGET) }] : [];
    });
};

export const catalogFindings = function catalogFindings(
    outDir: string,
    site: string,
    routeFiles: ReadonlySet<string>,
): Finding[] {
    const present = new Set(walk(outDir, outDir));
    const idsFile = fileOfAddress(idsIndex().json);
    if (!present.has(idsFile)) {
        return [{ file: idsFile, message: NO_ID_MANIFEST }];
    }
    const shardFiles = shardFilesOf(textAt(outDir, idsFile), site);
    const rows = shardFiles.filter((file) => present.has(file)).flatMap((file) => rowsOf(textAt(outDir, file)));
    const heads = [idsFile, ...shardFiles, fileOfAddress(siteIndex().json), fileOfAddress(resolveMap().json)];
    const listed = new Set([
        ...heads,
        ...heads.map(markdownTwin),
        ...rows.map((row) => fileOfAddress(localAddress(site, row.json))),
        ...rows.flatMap((row) => (row.markdown === null ? [] : [fileOfAddress(localAddress(site, row.markdown))])),
        ...textsNamedIn(
            outDir,
            site,
            rows.map((row) => fileOfAddress(localAddress(site, row.json))).filter((file) => present.has(file)),
        ),
    ]);
    const catalog = [...present].filter((file) => !routeFiles.has(file) && isCatalogFile(file));
    const orphans = catalog
        .filter((file) => !listed.has(file) && !RESOLVE_FOLDERS.some((folder) => file.startsWith(folder)))
        .map((file) => ({ file, message: UNLISTED_LEAF }));
    const jsonLeaves = catalog.filter((file) => file.endsWith(JSON_EXTENSION));
    const markdownLeaves = catalog.filter((file) => file.endsWith(MARKDOWN_EXTENSION));
    return [
        ...sitemapFindings(outDir, site, markdownLeaves, present),
        ...rows.flatMap((row) => rowFindings(outDir, site, row, present)),
        ...orphans,
        ...jsonLeaves.flatMap((file) => danglingIn(outDir, site, file, present)),
        ...walkFindings(outDir, jsonLeaves, present),
        ...budgetFindings(outDir, catalog),
    ];
};
