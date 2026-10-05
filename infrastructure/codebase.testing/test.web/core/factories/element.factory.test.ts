import {
    appendChildren,
    clearChildren,
    createElement,
    createVectorElement,
    createVectorNode,
} from "@banes-lab/web/core/factories/element.factory.ts";
import { describe, expect, it } from "vitest";

const CLASS_NAME = "box";
const LABEL = "label";
const ATTRIBUTE = "data-role";
const VALUE = "panel";

describe("createElement", () => {
    it("applies class, text, attributes and children", () => {
        const child = createElement("span", { text: LABEL });
        const element = createElement("div", {
            attributes: { [ATTRIBUTE]: VALUE },
            children: [child, LABEL],
            className: CLASS_NAME,
        });
        expect(element.tagName).toBe("DIV");
        expect(element.className).toBe(CLASS_NAME);
        expect(element.getAttribute(ATTRIBUTE)).toBe(VALUE);
        expect(element.childNodes).toHaveLength(2);
        expect(element.firstElementChild).toBe(child);
    });

    it("creates a bare element when no spec is given", () => {
        expect(createElement("p").outerHTML).toBe("<p></p>");
    });
});

describe("appendChildren", () => {
    it("appends elements and strings in order", () => {
        const parent = createElement("div");
        appendChildren(parent, [LABEL, createElement("i")]);
        expect(parent.childNodes).toHaveLength(2);
        expect(parent.lastElementChild?.tagName).toBe("I");
    });
});

describe("createVectorElement", () => {
    it("parses vector markup into an element owned by the page document", () => {
        const vector = createVectorElement('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4"><g/></svg>');
        expect(vector.tagName).toBe("svg");
        expect(vector.ownerDocument).toBe(document);
        expect(vector.querySelector("g")).not.toBeNull();
    });
});

describe("createVectorNode", () => {
    it("builds the node in the vector namespace, so the browser draws it", () => {
        const node = createVectorNode("rect");
        expect(node.namespaceURI).toBe("http://www.w3.org/2000/svg");
        expect(node.tagName).toBe("rect");
    });

    it("applies class, text, attributes and children", () => {
        const child = createVectorNode("tspan", { text: LABEL });
        const node = createVectorNode("text", {
            attributes: { [ATTRIBUTE]: VALUE },
            children: [child],
            className: CLASS_NAME,
        });
        expect(node.getAttribute("class")).toBe(CLASS_NAME);
        expect(node.getAttribute(ATTRIBUTE)).toBe(VALUE);
        expect(node.firstElementChild).toBe(child);
    });
});

describe("clearChildren", () => {
    it("removes every child", () => {
        const parent = createElement("div", { children: [createElement("i"), LABEL] });
        clearChildren(parent);
        expect(parent.childNodes).toHaveLength(0);
    });
});
