import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { assertFiguresFilled } from "@banes-lab/build-scripts/core/validators/figure.validator.ts";
import { emptyFigure } from "@banes-lab/build-scripts/configuration/strings/page.strings.ts";

const contentOf = function contentOf(html: string): Element {
    return new JSDOM(`<main>${html}</main>`).window.document.body;
};

describe("assertFiguresFilled", () => {
    it("accepts a figure with a body beside its caption", () => {
        const content = contentOf(
            `<figure><figcaption><span>A1·a</span><span>the walk</span></figcaption><pre><code>flowchart TB</code></pre></figure>`,
        );
        expect(() => {
            assertFiguresFilled(content, "/methodology");
        }).not.toThrow();
    });

    it("refuses a figure that holds only its caption, naming the route and the caption", () => {
        const content = contentOf(
            `<figure><figcaption><span>D1·d</span><span>a venue receiving positions</span></figcaption><div></div></figure>`,
        );
        expect(() => {
            assertFiguresFilled(content, "/methodology/collaborate");
        }).toThrow(emptyFigure("/methodology/collaborate", "D1·d a venue receiving positions"));
    });
});
