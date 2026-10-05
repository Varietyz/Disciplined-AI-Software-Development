import "@banes-lab/web/presentation/records/home.record.ts";
import { ROUTE_CHANGED, ROUTE_REQUESTED } from "@banes-lab/web/core/ids/route.ids.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { emitEvent, subscribeEvent } from "@banes-lab/web/core/buses/base.bus.ts";
import { HOME_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { MISSING_PAGE_TITLE } from "@banes-lab/web/configuration/strings/page.strings.ts";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";
import { pagePath } from "@banes-lab/web/core/assets/link.assets.ts";
import { startRouting } from "@banes-lab/web/runtime/coordinators/route.coordinator.ts";

const UNKNOWN = "no-such-page";
const HOME_CLASS = "home-content";

const mountMain = function mountMain(): HTMLElement {
    const main = createElement("main");
    Object.defineProperty(main, "scrollTo", { configurable: true, value: vi.fn() });
    document.body.append(main);
    return main;
};

const changedPages = async function changedPages(expected: number): Promise<string[]> {
    return new Promise((resolve) => {
        const changed: string[] = [];
        const unsubscribe = subscribeEvent(ROUTE_CHANGED, (event) => {
            changed.push(event.page);
            if (changed.length === expected) {
                unsubscribe();
                resolve(changed);
            }
        });
    });
};

afterEach(() => {
    document.body.replaceChildren();
    window.history.replaceState({}, "", "/");
});

describe("startRouting", () => {
    it("loads and renders the page matching the current path on start", async () => {
        const main = mountMain();
        const changed = changedPages(1);
        const dispose = startRouting(main);
        expect(await changed).toStrictEqual([HOME_PAGE]);
        expect(main.querySelector(`.${HOME_CLASS}`)).not.toBeNull();
        dispose();
    });

    it("navigates on a route request, pushing the path and announcing the change once the page is loaded", async () => {
        const main = mountMain();
        const started = changedPages(1);
        const dispose = startRouting(main);
        expect(await started).toStrictEqual([HOME_PAGE]);
        const changed = changedPages(1);
        emitEvent({ name: ROUTE_REQUESTED, page: UNKNOWN });
        expect(window.location.pathname).toBe(pagePath(UNKNOWN));
        expect(await changed).toStrictEqual([UNKNOWN]);
        expect(main.textContent.includes(MISSING_PAGE_TITLE)).toBe(true);
        dispose();
    });
});
