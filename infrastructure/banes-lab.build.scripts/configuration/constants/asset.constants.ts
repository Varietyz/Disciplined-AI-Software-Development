import {
    FULL_TEXT_FOLDER,
    FULL_TEXT_ROUTE,
    SITEMAP_PART_PREFIX,
    SITEMAP_ROUTE,
} from "#configuration/constants/site.constants";

export const TEXT_EXTENSIONS: ReadonlySet<string> = new Set([
    ".css",
    ".html",
    ".js",
    ".json",
    ".md",
    ".svg",
    ".txt",
    ".xml",
]);

export const REFERENCE_DELIMITERS: ReadonlySet<string> = new Set([
    " ",
    "\t",
    "\n",
    "\r",
    '"',
    "'",
    "`",
    "\\",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    "<",
    ">",
    ",",
    ";",
    "=",
]);

export const REFERENCE_ENDS: ReadonlySet<string> = new Set(["?", "#"]);

export const PAGE_EXTENSION = ".html";

export const BROTLI_EXTENSION = ".br";

export const BROTLI_THRESHOLD = 256;

export const BROTLI_CACHE = "brotli";

export const PRECOMPRESSED_EXTENSIONS: ReadonlySet<string> = new Set([".br", ".gz"]);

export const SERVED_ROOT_FILES: ReadonlySet<string> = new Set([
    "favicon.ico",
    "llms.txt",
    FULL_TEXT_ROUTE,
    "robots.txt",
    SITEMAP_ROUTE.slice(1),
]);

export const SERVED_EXTENSIONS: ReadonlySet<string> = new Set([".html", ".md"]);

export const SERVED_ROUTES: readonly string[] = ["json/", `${FULL_TEXT_FOLDER}/`, SITEMAP_PART_PREFIX];

export const ASSET_KEYS: readonly string[] = ["app.diagrams", "app.walks", "app.sources", "app.surfaces"];
