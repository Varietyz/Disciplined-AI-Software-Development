import { FONT_FAMILY, FONT_ROUTE, ICON_BASE, ICON_PREFIX, SUBSET_FILE } from "#configuration/constants/icons.constants";
import { codepointOf } from "#core/resolvers/icons.resolver";

const HEX = 16;

export const renderStylesheet = function renderStylesheet(names: readonly string[]): string {
    const face = [
        "@font-face {",
        "    font-display: swap;",
        `    font-family: "${FONT_FAMILY}";`,
        `    src: url("${FONT_ROUTE}${SUBSET_FILE}") format("woff2");`,
        "}",
    ];
    const base = [
        `.${ICON_BASE}::before,`,
        `[class^="${ICON_PREFIX}"]::before,`,
        `[class*=" ${ICON_PREFIX}"]::before {`,
        "    display: inline-block;",
        `    font-family: "${FONT_FAMILY}";`,
        "    font-style: normal;",
        "    font-variant: normal;",
        "    font-weight: normal;",
        "    line-height: 1;",
        "    text-transform: none;",
        "    vertical-align: -0.125em;",
        "    -webkit-font-smoothing: antialiased;",
        "    -moz-osx-font-smoothing: grayscale;",
        "}",
    ];
    const glyphs = names.map(
        (name) => `.${ICON_PREFIX}${name}::before {\n    content: "\\${codepointOf(name).toString(HEX)}";\n}`,
    );
    return `${[face.join("\n"), base.join("\n"), ...glyphs].join("\n\n")}\n`;
};

export const renderGlyphs = function renderGlyphs(names: readonly string[]): string {
    const entries = names.map(
        (name) => `    ["${ICON_PREFIX}${name}", ${JSON.stringify(String.fromCodePoint(codepointOf(name)))}],`,
    );
    return ["export const ICON_GLYPHS: ReadonlyMap<string, string> = new Map([", ...entries, "]);", ""].join("\n");
};

export const glyphTextOf = function glyphTextOf(names: readonly string[]): string {
    return names.map((name) => String.fromCodePoint(codepointOf(name))).join("");
};
