import { describe, expect, it } from "vitest";
import { fillMarkup, plainText } from "@banes-lab/web/presentation/renderers/text.renderer.ts";
import { ROUTE_REQUESTED } from "@banes-lab/web/core/ids/route.ids.ts";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";
import { subscribeEvent } from "@banes-lab/web/core/buses/base.bus.ts";

const EXTERNAL = "https://example.com/";
const INTERNAL = "/grammar";

describe("fillMarkup", () => {
    it("replaces the element's children with rendered runs and returns it", () => {
        const element = createElement("p", { text: "old" });
        const filled = fillMarkup(element, "a <em>b</em><br>c");
        expect(filled).toBe(element);
        expect(element.querySelector("em")?.textContent).toBe("b");
        expect(element.querySelector("br")).not.toBeNull();
        expect(element.textContent).toBe("a bc");
    });

    it("renders a link inside emphasis within one em, with the text after the link still emphasized", () => {
        const element = fillMarkup(createElement("p"), `<em>one <a href="${INTERNAL}">two</a> three</em> four`);
        const emphasis = element.querySelectorAll("em");
        expect(emphasis).toHaveLength(1);
        expect(emphasis[0]?.textContent).toBe("one two three");
        expect(emphasis[0]?.querySelector("a")?.textContent).toBe("two");
    });

    it("opens external links in a new tab and routes internal links through the page link without a class", () => {
        const element = fillMarkup(createElement("p"), `<a href="${EXTERNAL}">x</a><a href="${INTERNAL}">y</a>`);
        const [external, internal] = element.querySelectorAll("a");
        expect(external?.target).toBe("_blank");
        expect(internal?.target).toBe("");
        expect(internal?.hasAttribute("class")).toBe(false);
        const requested: string[] = [];
        const dispose = subscribeEvent(ROUTE_REQUESTED, (event) => {
            requested.push(event.path ?? "");
        });
        internal?.click();
        dispose();
        expect(requested).toStrictEqual([INTERNAL]);
    });
});

describe("plainText", () => {
    it("strips the markup and keeps the visible text", () => {
        expect(plainText(`Kind: <a href="${INTERNAL}">principle</a> and <code>x</code>`)).toBe("Kind: principle and x");
    });
});
