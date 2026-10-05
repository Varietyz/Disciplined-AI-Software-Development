import { PINNED_CLASS, PIN_OFFSET_PX } from "@banes-lab/web/configuration/constants/tab.constants.ts";
import { afterEach, describe, expect, it } from "vitest";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";
import { observePin } from "@banes-lab/web/core/observers/tab.observer.ts";

const ANCHOR_TOP = 200;

afterEach(() => {
    document.body.replaceChildren();
});

const mount = function mount(): {
    readonly anchor: HTMLElement;
    readonly scroller: HTMLElement;
    readonly tabs: HTMLElement;
} {
    const tabs = createElement("div");
    const anchor = createElement("div", { children: [tabs] });
    const scroller = createElement("main", { children: [anchor] });
    document.body.append(scroller);
    Object.defineProperty(anchor, "offsetTop", { configurable: true, value: ANCHOR_TOP });
    return { anchor, scroller, tabs };
};

describe("observePin", () => {
    it("pins the tabs once the scroller passes the anchor", () => {
        const { anchor, scroller, tabs } = mount();
        const dispose = observePin(scroller, anchor, tabs);
        scroller.scrollTop = ANCHOR_TOP;
        scroller.dispatchEvent(new Event("scroll"));
        expect(tabs.classList.contains(PINNED_CLASS)).toBe(true);
        scroller.scrollTop = ANCHOR_TOP - PIN_OFFSET_PX - 1;
        scroller.dispatchEvent(new Event("scroll"));
        expect(tabs.classList.contains(PINNED_CLASS)).toBe(false);
        dispose();
    });

    it("stops reacting after the disposer runs", () => {
        const { anchor, scroller, tabs } = mount();
        const dispose = observePin(scroller, anchor, tabs);
        dispose();
        scroller.scrollTop = ANCHOR_TOP;
        scroller.dispatchEvent(new Event("scroll"));
        expect(tabs.classList.contains(PINNED_CLASS)).toBe(false);
    });
});
