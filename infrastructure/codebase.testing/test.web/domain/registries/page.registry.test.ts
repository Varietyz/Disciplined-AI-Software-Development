import type { PageDefinition, PageEntry } from "@banes-lab/web/types/page.types.ts";
import { describe, expect, it, vi } from "vitest";
import {
    getPage,
    listPages,
    loadCompletePage,
    loadPage,
    loadedPage,
    registerPage,
    registeredPages,
} from "@banes-lab/web/domain/registries/page.registry.ts";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";

const ICON = "bi-x";
const LATE = "late-page";
const EARLY = "early-page";
const HIDDEN = "hidden-page";
const LOADED = "loaded-page";

const definition = function definition(id: string): PageDefinition {
    return {
        content: { heading: id, kind: "home", lead: id, rows: [], stats: [], thesis: id },
        description: id,
        id,
        render: () => createElement("div"),
        title: id,
    };
};

const page = function page(
    id: string,
    order: number,
    listed: boolean,
    load = vi.fn(async () => definition(id)),
): PageEntry {
    return {
        accent: ICON,
        description: id,
        icon: ICON,
        id,
        listed,
        load,
        mark: ICON,
        order,
        share: { headline: id, tagline: id },
        title: id,
    };
};

describe("registerPage", () => {
    it("makes the page reachable by id", () => {
        registerPage(page(LATE, 90, true));
        expect(getPage(LATE)?.id).toBe(LATE);
    });
});

describe("getPage", () => {
    it("answers undefined for an unregistered id", () => {
        expect(getPage(`${LATE}-missing`)).toBeUndefined();
    });
});

describe("listPages", () => {
    it("lists only listed pages, sorted by order", () => {
        registerPage(page(LATE, 90, true));
        registerPage(page(EARLY, 80, true));
        registerPage(page(HIDDEN, 70, false));
        const ids = listPages().map((entry) => entry.id);
        expect(ids.includes(HIDDEN)).toBe(false);
        expect(ids.indexOf(EARLY)).toBeLessThan(ids.indexOf(LATE));
    });
});

describe("registeredPages", () => {
    it("lists every registered page, unlisted ones included, sorted by order", () => {
        registerPage(page(LATE, 90, true));
        registerPage(page(HIDDEN, 70, false));
        const ids = registeredPages().map((entry) => entry.id);
        expect(ids.includes(HIDDEN)).toBe(true);
        expect(ids.indexOf(HIDDEN)).toBeLessThan(ids.indexOf(LATE));
    });
});

describe("loadPage and loadedPage", () => {
    it("loads a page once through its entry, caches the definition and answers undefined for an unknown id", async () => {
        const load = vi.fn(async () => definition(LOADED));
        registerPage(page(LOADED, 95, false, load));
        expect(loadedPage(LOADED)).toBeUndefined();
        const [first, second] = await Promise.all([loadPage(LOADED), loadPage(LOADED)]);
        expect(first?.id).toBe(LOADED);
        expect(second).toBe(first);
        expect(load).toHaveBeenCalledOnce();
        expect(loadedPage(LOADED)).toBe(first);
        expect(await loadPage(LOADED)).toBe(first);
        expect(load).toHaveBeenCalledOnce();
        expect(await loadPage(`${LOADED}-missing`)).toBeUndefined();
    });
});

describe("loadCompletePage", () => {
    it("replaces a page that offers completion with its complete form, and keeps one that does not", async () => {
        const COMPLETED = "completed-page";
        const full = definition(COMPLETED);
        const lazy = { ...definition(COMPLETED), complete: async () => full };
        registerPage(page(COMPLETED, 96, false, vi.fn(async () => lazy)));
        expect(await loadCompletePage(COMPLETED)).toBe(full);
        expect(loadedPage(COMPLETED)).toBe(full);
        expect(await loadCompletePage(LOADED)).toBe(loadedPage(LOADED));
    });
});
