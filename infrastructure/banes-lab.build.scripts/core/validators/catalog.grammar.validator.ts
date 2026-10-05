import type { CatalogFiles, GrammarKind, GrammarRow } from "#types/catalog.types";
import { GRAMMAR, kindOrNull, matchesTemplate } from "#core/converters/catalog.grammar.converter";
import { SLUGS_SEGMENT, SOURCE_SEGMENT, TEXT_EXTENSION } from "#configuration/constants/catalog.constants";
import {
    driftedLiteral,
    markdownMissing,
    noMarkdownForm,
    unexampledRow,
    unmatchedAddress,
    unslugged,
} from "#configuration/strings/catalog.strings";
import { existsSync, readFileSync } from "node:fs";
import type { Finding } from "#types/validation.types";
import { JSON_ROUTE } from "#configuration/constants/site.constants";
import { absolutePath } from "@ssot/paths";
import { isRecord } from "#core/selectors/base.selector";
import { join } from "node:path";
import { nameKeyOf } from "@govlab/context";
import { walk } from "#core/loaders/asset.loader";

const JSON_EXTENSION = ".json";
const PLACEHOLDER = "{";
const SLASH = "/";
const SLUG_FOLDER = `${JSON_ROUTE.slice(1)}api${SLASH}${SLUGS_SEGMENT}${SLASH}`;
const TEXT_KIND: GrammarKind = "text";

export const markdownFormFindings = function markdownFormFindings(rows: readonly GrammarRow[] = GRAMMAR): Finding[] {
    return rows
        .filter((row) => row.kind !== TEXT_KIND && row.address.markdown === null)
        .map((row) => ({ file: row.address.json, message: noMarkdownForm(row.address.json) }));
};

const addressOf = function addressOf(file: string): string {
    return SLASH + file.slice(0, -JSON_EXTENSION.length);
};

const kindFindings = function kindFindings(file: string): Finding[] {
    return kindOrNull(addressOf(file)) === null ? [{ file, message: unmatchedAddress(addressOf(file)) }] : [];
};

export const catalogFiles = function catalogFiles(outDir: string, routeFiles: ReadonlySet<string>): CatalogFiles {
    const files = walk(outDir, outDir);
    return {
        json: files.filter(
            (file) => file.startsWith(JSON_ROUTE.slice(1)) && file.endsWith(JSON_EXTENSION) && !routeFiles.has(file),
        ),
        text: files.filter((file) => file.startsWith(SOURCE_SEGMENT + SLASH) && file.endsWith(TEXT_EXTENSION)),
    };
};

export const grammarFindings = function grammarFindings(files: CatalogFiles): Finding[] {
    const jsonFiles = files.json;
    const addresses = [...jsonFiles.map(addressOf), ...files.text.map((file) => SLASH + file)];
    const unexampled = GRAMMAR.filter(
        (row) =>
            row.address.json.includes(PLACEHOLDER) &&
            !addresses.some((path) => matchesTemplate(row.address.json, path)),
    );
    return [
        ...jsonFiles.flatMap(kindFindings),
        ...unexampled.map((row) => ({ file: row.address.json, message: unexampledRow(row.address.json) })),
    ];
};

export const slugFindings = function slugFindings(outDir: string, jsonFiles: readonly string[]): Finding[] {
    return jsonFiles
        .filter((file) => file.startsWith(SLUG_FOLDER))
        .flatMap((file) => {
            const parsed: unknown = JSON.parse(readFileSync(join(outDir, file), "utf8"));
            const slugs = isRecord(parsed) && isRecord(parsed["slugs"]) ? Object.keys(parsed["slugs"]) : [];
            return slugs.filter((key) => nameKeyOf(key) !== key).map((key) => ({ file, message: unslugged(key) }));
        });
};

export const literalFindings = function literalFindings(site: string, file = absolutePath("app.nginxSite")): Finding[] {
    const text = existsSync(file) ? readFileSync(file, "utf8") : "";
    return text.includes(markdownMissing(site)) ? [] : [{ file, message: driftedLiteral(file) }];
};
