import {
    EMPTY_MAIN,
    EXCLUDED_ROUTE,
    INDEXED_ERROR_PAGE,
    NO_ORGANIZATION,
    WEAK_DESCRIPTION,
    missingSchemaField,
    missingText,
    missingWebPage,
    strayRoute,
    unknownSchemaProperty,
    unknownSchemaType,
    unlistedRoute,
    unservedEncoding,
    unservedLink,
    weakTitle,
    wrongAlternate,
    wrongCanonical,
} from "#configuration/strings/site.strings";
import type { Finding, PageArtifact, Seen, Twins } from "#types/validation.types";
import { JSON_ROUTE, SCHEMA_FIELDS, SCHEMA_KEYWORDS, SCHEMA_PROPERTIES } from "#configuration/constants/site.constants";
import { isFileRoute } from "#core/predicates/route.predicate";
import { isRecord } from "#core/selectors/base.selector";
import { locationsOf } from "#core/converters/build.converter";

const NOINDEX = "noindex";
const GRAPH_KEY = "@graph";
const TYPE_KEY = "@type";
const WEB_PAGE_TYPE = "WebPage";
const ORGANIZATION_TYPE = "Organization";
const CONTENT_URL_KEY = "contentUrl";
const FRAGMENT = "#";
const QUERY = "?";
const SLASH = "/";

const entitiesOf = function entitiesOf(schema: string | null): Record<string, unknown>[] {
    if (schema === null) {
        return [];
    }
    const parsed: unknown = JSON.parse(schema);
    if (!isRecord(parsed) || !Array.isArray(parsed[GRAPH_KEY])) {
        return [];
    }
    return parsed[GRAPH_KEY].filter(isRecord);
};

const missingFieldsOf = function missingFieldsOf(file: string, entity: Record<string, unknown>): Finding[] {
    const type = entity[TYPE_KEY];
    const fields = typeof type === "string" ? (SCHEMA_FIELDS.get(type) ?? []) : [];
    return fields
        .filter((field) => entity[field] === undefined)
        .map((field) => ({ file, message: missingSchemaField(String(type), field) }));
};

const typedEntitiesOf = function typedEntitiesOf(value: unknown): Record<string, unknown>[] {
    if (Array.isArray(value)) {
        return value.flatMap(typedEntitiesOf);
    }
    if (!isRecord(value)) {
        return [];
    }
    const own = typeof value[TYPE_KEY] === "string" ? [value] : [];
    return [...own, ...Object.values(value).flatMap(typedEntitiesOf)];
};

const foreignPropertiesOf = function foreignPropertiesOf(file: string, entity: Record<string, unknown>): Finding[] {
    const type = String(entity[TYPE_KEY]);
    const allowed = SCHEMA_PROPERTIES.get(type);
    if (allowed === undefined) {
        return [{ file, message: unknownSchemaType(type) }];
    }
    return Object.keys(entity)
        .filter((property) => !SCHEMA_KEYWORDS.has(property) && !allowed.has(property))
        .map((property) => ({ file, message: unknownSchemaProperty(type, property) }));
};

export const checkSchema = function checkSchema(file: string, artifact: PageArtifact, address: string): Finding[] {
    const entities = entitiesOf(artifact.schema);
    const findings: Finding[] = [];
    if (!entities.some((entity) => entity[TYPE_KEY] === ORGANIZATION_TYPE)) {
        findings.push({ file, message: NO_ORGANIZATION });
    }
    if (!entities.some((entity) => entity[TYPE_KEY] === WEB_PAGE_TYPE && entity["url"] === address)) {
        findings.push({ file, message: missingWebPage(address) });
    }
    return [
        ...findings,
        ...entities.flatMap((entity) => missingFieldsOf(file, entity)),
        ...typedEntitiesOf(entities).flatMap((entity) => foreignPropertiesOf(file, entity)),
    ];
};

const contentUrlsOf = function contentUrlsOf(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.flatMap(contentUrlsOf);
    }
    if (!isRecord(value)) {
        return [];
    }
    const own = typeof value[CONTENT_URL_KEY] === "string" ? [value[CONTENT_URL_KEY]] : [];
    return [...own, ...Object.values(value).flatMap(contentUrlsOf)];
};

export const checkEncodings = function checkEncodings(
    file: string,
    artifact: PageArtifact,
    isServed: (url: string) => boolean,
): Finding[] {
    return contentUrlsOf(entitiesOf(artifact.schema))
        .filter((url) => !isServed(url))
        .map((url) => ({ file, message: unservedEncoding(url) }));
};

export const checkAlternates = function checkAlternates(
    file: string,
    artifact: PageArtifact,
    expected: Twins,
): Finding[] {
    const pairs: readonly (readonly [string, string | null, string | null])[] = [
        ["Markdown", artifact.alternates.markdown, expected.markdown],
        ["JSON", artifact.alternates.json, expected.json],
    ];
    return pairs
        .filter(([, found, wanted]) => found !== wanted)
        .map(([form, found, wanted]) => ({ file, message: wrongAlternate(form, String(found), String(wanted)) }));
};

export const checkIndexable = function checkIndexable(
    file: string,
    artifact: PageArtifact,
    indexable: boolean,
): Finding[] {
    const excluded = artifact.robots?.includes(NOINDEX) ?? false;
    if (indexable === !excluded) {
        return [];
    }
    return [{ file, message: indexable ? EXCLUDED_ROUTE : INDEXED_ERROR_PAGE }];
};

export const checkPage = function checkPage(
    file: string,
    artifact: PageArtifact,
    address: string,
    seen: Seen,
): Finding[] {
    const findings: Finding[] = [];
    if (artifact.text.length === 0) {
        findings.push({ file, message: EMPTY_MAIN });
    }
    if (artifact.title.length === 0 || seen.titles.has(artifact.title)) {
        findings.push({ file, message: weakTitle(artifact.title) });
    }
    if (
        artifact.description === null ||
        artifact.description.length === 0 ||
        seen.descriptions.has(artifact.description)
    ) {
        findings.push({ file, message: WEAK_DESCRIPTION });
    }
    if (artifact.canonical !== address) {
        findings.push({ file, message: wrongCanonical(String(artifact.canonical), address) });
    }
    seen.titles.add(artifact.title);
    if (artifact.description !== null) {
        seen.descriptions.add(artifact.description);
    }
    return findings;
};

export const checkSitemap = function checkSitemap(file: string, xml: string, addresses: readonly string[]): Finding[] {
    const listed = new Set(locationsOf(xml));
    const registered = new Set(addresses);
    return [
        ...addresses
            .filter((address) => !listed.has(address))
            .map((address) => ({ file, message: unlistedRoute(address) })),
        ...[...listed]
            .filter((location) => !registered.has(location))
            .map((location) => ({ file, message: strayRoute(location) })),
    ];
};

export const checkText = function checkText(file: string, text: string, required: readonly string[]): Finding[] {
    return required
        .filter((needle) => !text.includes(needle))
        .map((needle) => ({ file, message: missingText(needle) }));
};

const routeOf = function routeOf(href: string): string {
    const stops = [href.indexOf(QUERY), href.indexOf(FRAGMENT)].filter((at) => at !== -1);
    return stops.length === 0 ? href : href.slice(0, Math.min(...stops));
};

const isPageLink = function isPageLink(href: string): boolean {
    return href.startsWith(SLASH) && !isFileRoute(href) && !href.startsWith(JSON_ROUTE);
};

export const checkLinks = function checkLinks(
    file: string,
    artifact: PageArtifact,
    served: ReadonlySet<string>,
): Finding[] {
    return artifact.links
        .filter((href) => isPageLink(href))
        .filter((href) => {
            const route = routeOf(href);
            return route.length > 0 && !served.has(route);
        })
        .map((href) => ({ file, message: unservedLink(href) }));
};
