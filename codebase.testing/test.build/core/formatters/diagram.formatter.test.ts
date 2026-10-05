import { describe, expect, it } from "vitest";
import { THEME_TOKENS } from "@banes-lab/build-scripts/configuration/constants/diagram.constants.ts";
import { stageMarkup } from "@banes-lab/build-scripts/core/formatters/diagram.formatter.ts";

describe("stageMarkup", () => {
    it("writes a stage page that loads the layout engine, the fonts and the site theme before it renders", () => {
        const tokens = new Map([
            ...THEME_TOKENS.map(([, token]): readonly [string, string] => [token, "#123456"]),
            ["--font-family-base", "Mono"],
        ]);
        const markup = stageMarkup(tokens);
        expect(markup).toContain("mermaid.registerLayoutLoaders(elk);");
        expect(markup).toContain("@font-face");
        expect(markup).toContain('"fontFamily":"Mono"');
        expect(markup).toContain("#123456");
        expect(markup).toContain("window.diagramsReady = true;");
    });
});
