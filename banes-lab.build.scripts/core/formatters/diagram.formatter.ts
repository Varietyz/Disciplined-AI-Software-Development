import {
    ELK_BUNDLE,
    ELK_ROUTE,
    FONT_FACES,
    FONT_ROUTE,
    MERMAID_BUNDLE,
    MERMAID_ROUTE,
} from "#configuration/constants/diagram.constants";
import { themeVariables } from "#core/converters/diagram.converter";

const fontFaceRules = function fontFaceRules(): string {
    return FONT_FACES.map(
        ([family, weight, file]) =>
            `@font-face{font-family:"${family}";font-weight:${weight};src:url("${FONT_ROUTE}${file}") format("woff2");}`,
    ).join("");
};

const fontLoads = function fontLoads(): string {
    return FONT_FACES.map(([family, weight]) => `document.fonts.load('${weight} 16px "${family}"')`).join(",");
};

export const stageMarkup = function stageMarkup(tokens: ReadonlyMap<string, string>): string {
    const config = JSON.stringify({
        elk: { cycleBreakingStrategy: "MODEL_ORDER", nodePlacementStrategy: "BRANDES_KOEPF" },
        flowchart: { curve: "basis", htmlLabels: false, useMaxWidth: false },
        fontFamily: tokens.get("--font-family-base"),
        fontSize: 14,
        layout: "elk",
        startOnLoad: false,
        theme: "base",
        themeVariables: themeVariables(tokens),
    });
    return [
        '<!doctype html><meta charset="utf-8"><title>diagram stage</title>',
        `<style>${fontFaceRules()}</style>`,
        '<body><script type="module">',
        `import mermaid from "${MERMAID_ROUTE}${MERMAID_BUNDLE}";`,
        `import elk from "${ELK_ROUTE}${ELK_BUNDLE}";`,
        "mermaid.registerLayoutLoaders(elk);",
        `mermaid.initialize(${config});`,
        `await Promise.all([${fontLoads()}]);`,
        "await document.fonts.ready;",
        "window.renderDiagram = async (id, source) => (await mermaid.render(id, source)).svg;",
        "window.diagramsReady = true;",
        "</script>",
    ].join("");
};
