import { ROUTE_CHANGED, ROUTE_REQUESTED } from "@banes-lab/web/core/ids/route.ids.ts";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { emitEvent, subscribeEvent } from "@banes-lab/web/core/buses/base.bus.ts";
import { SEARCH_DEBOUNCE_MS } from "@banes-lab/web/configuration/constants/search.constants.ts";
import { SEARCH_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import type { SearchToggle } from "@banes-lab/web/types/search.types.ts";
import { attachSearchToggle } from "@banes-lab/web/presentation/components/search.component.ts";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";

interface Mounted {
    readonly bar: HTMLElement;
    readonly page: HTMLElement;
    readonly toggle: SearchToggle;
}

const mount = function mount(): Mounted {
    const bar = createElement("nav", { className: "tab-bar" });
    const page = createElement("button", { className: "tab-button" });
    document.body.append(bar);
    return { bar, page, toggle: attachSearchToggle(bar, [page]) };
};

const type = function type(field: HTMLInputElement, value: string): void {
    field.value = value;
    field.dispatchEvent(new Event("input"));
};

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
    window.history.replaceState({}, "", "/");
    document.body.replaceChildren();
});

describe("attachSearchToggle", () => {
    it("shows the page buttons and a search button until the search opens", () => {
        const { bar, page, toggle } = mount();
        expect(bar.firstElementChild).toBe(page);
        expect(bar.querySelector("input")).toBeNull();
        bar.querySelector<HTMLButtonElement>("button:last-child")?.click();
        expect(bar.contains(page)).toBe(false);
        expect(bar.querySelector("input.filter-box")).not.toBeNull();
        toggle.dispose();
    });

    it("requests the seeded results route once the typing settles", () => {
        const { bar, toggle } = mount();
        const requested: string[] = [];
        const release = subscribeEvent(ROUTE_REQUESTED, (event) => {
            requested.push(event.path ?? "");
        });
        toggle.showField("");
        const field = bar.querySelector<HTMLInputElement>("input");
        if (field === null) {
            throw new Error("the search field is shown once open");
        }
        type(field, "g");
        type(field, "gate check");
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
        expect(requested).toStrictEqual(["/search?q=gate+check"]);
        release();
        toggle.dispose();
    });

    it("ignores a query too short to search", () => {
        const { bar, toggle } = mount();
        const requested: string[] = [];
        const release = subscribeEvent(ROUTE_REQUESTED, (event) => {
            requested.push(event.path ?? "");
        });
        toggle.showField("");
        const field = bar.querySelector<HTMLInputElement>("input");
        if (field !== null) {
            type(field, "g");
        }
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
        expect(requested).toStrictEqual([]);
        release();
        toggle.dispose();
    });

    it("closes on Escape and restores the page buttons", () => {
        const { bar, page, toggle } = mount();
        toggle.showField("gate");
        bar.querySelector("input")?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        expect(bar.firstElementChild).toBe(page);
        toggle.dispose();
    });

    it("opens with the seeded query when the route lands on the results page", () => {
        const { bar, toggle } = mount();
        window.history.replaceState({}, "", "/search?q=drift");
        emitEvent({ name: ROUTE_CHANGED, page: SEARCH_PAGE });
        expect(bar.querySelector<HTMLInputElement>("input")?.value).toBe("drift");
        toggle.showButtons();
        toggle.dispose();
        emitEvent({ name: ROUTE_CHANGED, page: SEARCH_PAGE });
        expect(bar.querySelector("input")).toBeNull();
    });
});
