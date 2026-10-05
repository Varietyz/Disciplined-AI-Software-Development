import { declareStyle, declaredStyle } from "@banes-lab/web/core/registries/style.registry.ts";
import { describe, expect, it } from "vitest";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";

const NONCE = "test-nonce";
const RATIO_PROPERTY = "--diagram-ratio";

const sheetRules = function sheetRules(): string[] {
    return [...document.head.querySelectorAll("style")].flatMap((holder) =>
        [...(holder.sheet?.cssRules ?? [])].map((rule) => rule.cssText),
    );
};

describe("declareStyle", () => {
    it("declares the value in a stylesheet rather than on the node", () => {
        const meta = createElement("meta", { attributes: { property: "csp-nonce" } });
        meta.nonce = NONCE;
        document.head.append(meta);
        const target = createElement("div");
        declareStyle(target, RATIO_PROPERTY, "2");
        expect(target.getAttribute("style")).toBeNull();
        expect(target.className.length).toBeGreaterThan(0);
        expect(sheetRules().join("")).toContain(RATIO_PROPERTY);
    });

    it("carries the page nonce onto the stylesheet it opens", () => {
        const target = createElement("div");
        declareStyle(target, RATIO_PROPERTY, "3");
        const holder = document.head.querySelector("style");
        expect(holder?.nonce).toBe(NONCE);
    });

    it("reuses one rule per node across repeated declarations", () => {
        const target = createElement("div");
        declareStyle(target, RATIO_PROPERTY, "4");
        const first = target.className;
        declareStyle(target, RATIO_PROPERTY, "5");
        expect(target.className).toBe(first);
        expect(sheetRules().join("")).toContain("5");
        expect(declaredStyle(target, RATIO_PROPERTY)).toBe("5");
        expect(declaredStyle(createElement("div"), RATIO_PROPERTY)).toBe("");
    });
});
