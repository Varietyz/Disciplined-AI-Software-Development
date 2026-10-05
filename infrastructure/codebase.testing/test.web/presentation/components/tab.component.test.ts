import { afterEach, describe, expect, it, vi } from "vitest";
import {
    createJumpButton,
    createTabButton,
    scrollToId,
    scroller,
} from "@banes-lab/web/presentation/components/tab.component.ts";
import { ACTIVE_CLASS } from "@banes-lab/web/configuration/constants/element.constants.ts";
import { MAIN_ID } from "@banes-lab/web/core/ids/site.ids.ts";
import { TAB_SELECTED } from "@banes-lab/web/core/ids/tab.ids.ts";
import type { Tab } from "@banes-lab/web/types/document.types.ts";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";
import { subscribeEvent } from "@banes-lab/web/core/buses/base.bus.ts";

const PAGE = "grammar";
const TARGET = "target-section";
const SYMBOL = "A1.2";
const LABEL = "Jump";
const TAB: Tab = { icon: "bi-book", id: "guide", label: "Guide", sections: [] };
const HREF = "/grammar/guide";

const mountMain = function mountMain(): HTMLElement {
    const main = createElement("main", { attributes: { id: MAIN_ID } });
    document.body.append(main);
    return main;
};

afterEach(() => {
    document.body.replaceChildren();
});

describe("scroller", () => {
    it("finds the main scroll container by its id", () => {
        expect(scroller()).toBeNull();
        const main = mountMain();
        expect(scroller()).toBe(main);
    });
});

describe("scrollToId", () => {
    it("scrolls the main container smoothly so the target sits centered, and re-measures once the scroll ends", () => {
        const main = mountMain();
        const scrolled = vi.fn();
        let targetTop = 500;
        Object.defineProperty(main, "scrollTo", { configurable: true, value: scrolled });
        Object.defineProperty(main, "getBoundingClientRect", {
            configurable: true,
            value: () => ({ height: 800, top: 0 }),
        });
        const target = createElement("section", { attributes: { id: TARGET } });
        Object.defineProperty(target, "getBoundingClientRect", {
            configurable: true,
            value: () => ({ height: 100, top: targetTop }),
        });
        main.append(target);
        scrollToId(TARGET);
        expect(scrolled).toHaveBeenCalledWith({ behavior: "smooth", top: 150 });
        targetTop = 900;
        main.dispatchEvent(new Event("scrollend"));
        main.dispatchEvent(new Event("scrollend"));
        expect(scrolled).toHaveBeenCalledTimes(2);
        expect(scrolled).toHaveBeenLastCalledWith({ behavior: "smooth", top: 550 });
    });

    it("leaves the scroll position alone when the target is already centered", () => {
        const main = mountMain();
        const scrolled = vi.fn();
        Object.defineProperty(main, "scrollTo", { configurable: true, value: scrolled });
        main.append(createElement("section", { attributes: { id: TARGET } }));
        scrollToId(TARGET);
        expect(scrolled).not.toHaveBeenCalled();
    });

    it("opens the target's own collapsed details and every collapsed ancestor before scrolling", () => {
        const main = mountMain();
        Object.defineProperty(main, "scrollTo", { configurable: true, value: vi.fn() });
        const outer = createElement("details");
        const target = createElement("section", { attributes: { id: TARGET } });
        const own = createElement("details");
        target.append(own);
        outer.append(target);
        main.append(outer);
        scrollToId(TARGET);
        expect(outer.open).toBe(true);
        expect(own.open).toBe(true);
    });
});

describe("createTabButton", () => {
    it("marks the active tab and emits the selection on click", () => {
        const selected: string[] = [];
        const dispose = subscribeEvent(TAB_SELECTED, (event) => {
            selected.push(event.tab);
        });
        const button = createTabButton(PAGE, TAB, true, HREF);
        expect(button.classList.contains(ACTIVE_CLASS)).toBe(true);
        expect(button.getAttribute("href")).toBe(HREF);
        expect(button.textContent.includes(TAB.label)).toBe(true);
        button.click();
        dispose();
        expect(selected).toStrictEqual([TAB.id]);
    });
});

describe("createJumpButton", () => {
    it("shows the symbol and label", () => {
        const button = createJumpButton(SYMBOL, LABEL, TARGET);
        expect(button.textContent).toBe(SYMBOL + LABEL);
    });
});
