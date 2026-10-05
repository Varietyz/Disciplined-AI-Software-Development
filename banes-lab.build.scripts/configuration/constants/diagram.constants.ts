export const MERMAID_PACKAGE = "mermaid";
export const ELK_PACKAGE = "@mermaid-js/layout-elk";
export const MERMAID_BUNDLE = "mermaid.esm.min.mjs";
export const ELK_BUNDLE = "mermaid-layout-elk.esm.min.mjs";
export const MERMAID_ROUTE = "/mermaid/";
export const ELK_ROUTE = "/elk/";
export const FONT_ROUTE = "/fonts/";
export const STYLESHEET_FILE = "diagrams.generated.css";
export const DIAGRAM_FILE_PREFIX = "diagram.";
export const DIAGRAM_FILE_SUFFIX = ".generated.svg";

export const MEDIA_TYPES: ReadonlyMap<string, string> = new Map([
    [".mjs", "text/javascript"],
    [".js", "text/javascript"],
    [".json", "application/json"],
    [".woff2", "font/woff2"],
    [".html", "text/html; charset=utf-8"],
]);

export const FONT_FACES: readonly (readonly [string, string, string])[] = [
    ["JetBrains Mono", "400", "jetbrains-mono.regular.font.woff2"],
    ["JetBrains Mono", "500", "jetbrains-mono.medium.font.woff2"],
    ["JetBrains Mono", "700", "jetbrains-mono.bold.font.woff2"],
];

export const THEME_TOKENS: readonly (readonly [string, string])[] = [
    ["primaryColor", "--banes-lab-main"],
    ["primaryTextColor", "--white-alpha-tertiary"],
    ["primaryBorderColor", "--white-alpha-border"],
    ["secondaryColor", "--code-block"],
    ["secondaryTextColor", "--text-light-gray"],
    ["secondaryBorderColor", "--white-alpha-border"],
    ["tertiaryColor", "--black-alpha-overlay"],
    ["tertiaryTextColor", "--text-light-gray"],
    ["tertiaryBorderColor", "--white-alpha-border"],
    ["lineColor", "--tab-accent"],
    ["textColor", "--text-light-gray"],
    ["nodeTextColor", "--white"],
    ["clusterBkg", "--card-bg"],
    ["clusterBorder", "--white-alpha-border"],
    ["edgeLabelBackground", "--code-block"],
    ["titleColor", "--white"],
    ["fontFamily", "--font-family-base"],
];
