export const PRETTIER_EXTENSIONS: ReadonlySet<string> = new Set([
    "cjs",
    "css",
    "cts",
    "flow",
    "gql",
    "graphql",
    "handlebars",
    "hbs",
    "html",
    "js",
    "json",
    "json5",
    "jsonc",
    "jsx",
    "less",
    "markdown",
    "md",
    "mdx",
    "mjs",
    "mts",
    "scss",
    "ts",
    "tsx",
    "vue",
    "yaml",
    "yml",
]);

export const GENERATED_MARKER = ".generated.";

export const MARKER_EXEMPT_BASENAMES: ReadonlySet<string> = new Set(["readme.md"]);

export const WRITE_OWNER_MODULES: ReadonlySet<string> = new Set<string>();

export const WRITER_FUNCTIONS: ReadonlySet<string> = new Set<string>();
