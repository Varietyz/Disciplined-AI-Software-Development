import { ALGO_FACE, ARCH_FACE, LEX_FACE, REASON_FACE } from "@govlab/constants";
import { ANATOMY_FACE, CHAPTER_FACE } from "@banes-lab/web/constants/vocabulary.constants";
import type { GrammarKind } from "#types/catalog.types";

export const API_SEGMENT = "api";
export const PAGES_SEGMENT = "pages";
export const RECORDS_SEGMENT = "records";
export const FACETS_SEGMENT = "facets";
export const SOURCE_SEGMENT = "source";
export const RESOLVE_SEGMENT = "resolve";
export const CLOSURE_SEGMENT = "closure";
export const ROUTE_SEGMENT = "route";
export const NUMBERS_SEGMENT = "numbers";
export const IDS_SEGMENT = "ids";
export const SEARCH_SEGMENT = "search";
export const SEARCH_KIND = "search";
export const CONTACT_SEGMENT = "contact";
export const SCHEMA_SEGMENT = "schema";
export const MOVED_SEGMENT = "moved";
export const QUERY_SEGMENT = "query";
export const QUERY_ENDPOINT = "/q";
export const QUERY_LIMITS = { defaultLimit: 50, depth: 3, limit: 200 } as const;
export const QUERY_FUZZY = {
    stemMinimum: 5,
    suffixes: ["ation", "ency", "ence", "ment", "ness", "ity", "ent", "ing", "ion", "ive", "al"],
    suggestions: 5,
} as const;
export const SCHEMA_DIALECT = "https://json-schema.org/draft/2020-12/schema";
export const SCHEMA_KIND = "schema" satisfies GrammarKind;
export const MAP_KEY_THRESHOLD = 32;
export const SLUGS_SEGMENT = "slugs";
export const TEXT_EXTENSION = ".txt";
export const CATALOG_VERSION = 2;
export const PATH_PLACEHOLDER = "{path}";
export const FOLDER_PLACEHOLDER = "{folder}";
export const SPANNING_PLACEHOLDERS: ReadonlySet<string> = new Set([PATH_PLACEHOLDER, FOLDER_PLACEHOLDER]);
export const CATALOG_FILE_BUDGET = 512 * 1024;
export const INDEX_PART_BUDGET = CATALOG_FILE_BUDGET / 2;
export const INDEX_PART_MARK = "_";
export const INDEX_PART_KIND = "index-part";
export const SLUG_CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789";
export const SLUG_SEPARATOR = "-";
export const LEADING_ARTICLES: ReadonlySet<string> = new Set(["the", "a", "an"]);
export const RESOLVE_FIRST: readonly string[] = [CHAPTER_FACE, ARCH_FACE, LEX_FACE, ALGO_FACE, REASON_FACE];
export const RESOLVE_LAST: readonly string[] = [ANATOMY_FACE];
export const SECTION_SEARCH = "sections";
export const RECORD_SEARCH = "records";
export const FILE_SEARCH = "files";
export const RESOLVE_REF = "api:resolve";
export const RESOLVE_PREFIX = `${RESOLVE_REF}/`;
export const INDEX_KIND = "index";
export const API_PREFIX = "api:";
export const QUERY_REFS: ReadonlySet<string> = new Set([
    "api:route",
    "api:search",
    "api:resolve",
    "api:contact",
    "api:ids",
    "api:moved",
    "api:query",
]);
export const RESERVED_SEGMENTS: ReadonlySet<string> = new Set([API_SEGMENT, RECORDS_SEGMENT, SOURCE_SEGMENT]);
