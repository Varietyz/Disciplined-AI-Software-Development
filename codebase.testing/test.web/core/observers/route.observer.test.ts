import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { holdScroll, isReload } from "@banes-lab/web/core/observers/route.observer.ts";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";

const TOP = 600;

class IdleResizeObserver {
    public observe(): void {}

    public disconnect(): void {}
}

const scroller = function scroller(height: number): { element: HTMLElement; scrollTo: ReturnType<typeof vi.fn> } {
    const element = createElement("main", { children: [createElement("div")] });
    const scrollTo = vi.fn();
    Object.defineProperty(element, "scrollTo", { configurable: true, value: scrollTo });
    Object.defineProperty(element, "scrollHeight", { configurable: true, value: height });
    Object.defineProperty(element, "clientHeight", { configurable: true, value: 400 });
    return { element, scrollTo };
};

beforeEach(() => {
    vi.stubGlobal("ResizeObserver", IdleResizeObserver);
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("isReload", () => {
    it("reads the navigation entry's type", () => {
        const reload = {
            duration: 0,
            entryType: "navigation",
            name: "",
            startTime: 0,
            toJSON: () => ({}),
            type: "reload",
        };
        vi.spyOn(performance, "getEntriesByType").mockReturnValue([reload]);
        expect(isReload()).toBe(true);
        vi.spyOn(performance, "getEntriesByType").mockReturnValue([]);
        expect(isReload()).toBe(false);
    });
});

describe("holdScroll", () => {
    it("scrolls to the saved position at once", () => {
        const { element, scrollTo } = scroller(2000);
        const dispose = holdScroll(element, TOP);
        expect(scrollTo).toHaveBeenCalledWith(0, TOP);
        dispose();
    });

    it("stops re-applying the position once the reader scrolls", () => {
        const { element } = scroller(500);
        const removed = vi.spyOn(element, "removeEventListener");
        holdScroll(element, TOP);
        element.dispatchEvent(new Event("wheel"));
        expect(removed).toHaveBeenCalled();
    });
});
