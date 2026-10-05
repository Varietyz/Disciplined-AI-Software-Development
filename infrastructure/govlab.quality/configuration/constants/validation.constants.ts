export const PROJECT_TOOL = "govlab-native";

export const VALIDATOR_SUFFIX = ".validator.ts";

export const CONSTANT_EXTENSIONS: readonly string[] = ["ts", "mts", "cts", "js", "mjs", "cjs"];

export const CSS_EXTENSIONS: readonly string[] = ["css", "scss"];

export const SCRIPT_EXTENSIONS: readonly string[] = ["ts", "tsx", "mts", "cts", "js", "mjs", "cjs"];

export const NAMING_EXTENSIONS: readonly string[] = ["js", "ts", "mjs", "cjs", "jsx", "tsx", "css", "scss"];

export const GATE_SOURCE_EXTENSIONS: ReadonlySet<string> = new Set([".ts", ".tsx", ".mts", ".cts", ".css", ".scss"]);

export const RUNTIME_RELATIVE_MARKERS: readonly string[] = ["import.meta", "__dirname", "__filename", "process.env"];

export const BASE_COMPONENTS: readonly string[] = [
    "btn",
    "form",
    "input",
    "select",
    "textarea",
    "modal",
    "card",
    "alert",
    "badge",
    "dropdown",
    "tooltip",
    "tabs",
    "accordion",
    "table",
    "nav",
    "menu",
];

export const COMPONENT_BOUNDARIES: ReadonlySet<string> = new Set(["-", " ", ".", ":", ",", ">", "{"]);

export const PAGES_SEGMENT = "/pages/";

export const ALLOWED_VAR_FILES: readonly string[] = [
    "tokens.css",
    "variables.css",
    "theme.css",
    "style-tokens.css",
    "colors.css",
    "typography.css",
    "effects.css",
    "objects.css",
];

export const ALLOWED_VAR_DIRS: readonly string[] = ["/styles/globals/", "/styles/tokens/"];

export const MOBILE_SUFFIX = "-mobile.css";
