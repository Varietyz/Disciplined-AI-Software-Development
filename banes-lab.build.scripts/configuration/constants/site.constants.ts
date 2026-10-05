import { ANATOMY_PAGE, ONTOLOGY_PAGE } from "@banes-lab/web/ids/page.ids";

export const JSON_ROUTE = "/json/";
export const FILE_ROUTES: readonly string[] = ["/assets/", "/static/"];
export const FULL_TEXT_ROUTE = "llms-full.txt";
export const FULL_TEXT_FOLDER = "llms-full";
export const FULL_TEXT_EXTENSION = ".txt";
export const REFERENCE_PAGES: ReadonlySet<string> = new Set([ONTOLOGY_PAGE, ANATOMY_PAGE]);
export const SITEMAP_ROUTE = "/sitemap.xml";
export const CATALOG_SITEMAP_ROUTE = "/sitemap-catalog.xml";
export const PAGE_SITEMAP_ROUTE = "/sitemap-pages.xml";
export const SOURCE_SITEMAP_ROUTE = "/sitemap-sources.xml";
export const SITEMAP_PART_PREFIX = "sitemap-";
export const SITEMAP_EXTENSION = ".xml";
export const SITEMAP_PART_JOIN = "-";
export const SITEMAP_URL_CAP = 50_000;
export const SITEMAP_BYTE_CAP = 52_428_800;
export const MARKDOWN_EXTENSION = ".md";

export const SCHEMA_FIELDS: ReadonlyMap<string, readonly string[]> = new Map([
    ["Dataset", ["name", "description", "creator", "license"]],
]);

export const SCHEMA_KEYWORDS: ReadonlySet<string> = new Set(["@id", "@type"]);

export const SCHEMA_PROPERTIES: ReadonlyMap<string, ReadonlySet<string>> = new Map([
    ["BreadcrumbList", new Set(["itemListElement"])],
    ["ContactPoint", new Set(["email", "url"])],
    [
        "CreativeWork",
        new Set(["alternateName", "author", "creator", "description", "license", "name", "sameAs", "url", "version"]),
    ],
    ["DataDownload", new Set(["contentUrl", "encodingFormat", "name"])],
    ["Dataset", new Set(["creator", "description", "distribution", "license", "name", "url", "version"])],
    ["ListItem", new Set(["item", "name", "position"])],
    ["MediaObject", new Set(["contentUrl", "encodingFormat"])],
    [
        "Organization",
        new Set([
            "address",
            "contactPoint",
            "email",
            "founder",
            "foundingDate",
            "logo",
            "name",
            "sameAs",
            "taxID",
            "url",
            "vatID",
        ]),
    ],
    ["Person", new Set(["email", "name", "sameAs", "url", "worksFor"])],
    ["PostalAddress", new Set(["addressCountry", "addressLocality"])],
    ["SoftwareSourceCode", new Set(["codeRepository", "isPartOf", "license", "name", "programmingLanguage"])],
    [
        "WebPage",
        new Set([
            "author",
            "breadcrumb",
            "description",
            "encoding",
            "hasPart",
            "inLanguage",
            "isPartOf",
            "mainEntity",
            "name",
            "publisher",
            "url",
        ]),
    ],
    ["WebPageElement", new Set(["encoding", "name", "url"])],
    ["WebSite", new Set(["description", "inLanguage", "name", "publisher", "url"])],
]);

export const AI_AGENTS: readonly string[] = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "anthropic-ai",
    "Google-Extended",
    "PerplexityBot",
    "Perplexity-User",
    "CCBot",
    "Applebot-Extended",
    "Bytespider",
    "meta-externalagent",
    "Amazonbot",
    "cohere-ai",
    "DuckAssistBot",
    "YouBot",
];
