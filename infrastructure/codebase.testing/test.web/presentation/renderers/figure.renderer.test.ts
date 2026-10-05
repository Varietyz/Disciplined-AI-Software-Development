import { describe, expect, it } from "vitest";
import type { FigureBlock } from "@banes-lab/web/types/block.types.ts";
import { TEXT_LANGUAGE } from "@banes-lab/web/configuration/constants/code.constants.ts";
import { renderFigure } from "@banes-lab/web/presentation/renderers/figure.renderer.ts";

const CAPTION = "A sample the caption names";
const CODE = "one line";
const TITLE = "A sample";

const BLOCK: FigureBlock = {
    caption: CAPTION,
    figure: { code: CODE, kind: "code", language: TEXT_LANGUAGE, title: TITLE },
    kind: "figure",
};

describe("renderFigure", () => {
    it("wraps the inner block in a figure carrying its caption", () => {
        const figure = renderFigure(BLOCK);
        expect(figure.tagName).toBe("FIGURE");
        expect(figure.querySelector(".figure-caption")?.textContent).toBe(CAPTION);
        expect(figure.querySelector("pre")?.textContent.includes(CODE)).toBe(true);
    });
});
