import "@banes-lab/web/presentation/records/search.record.ts";
import { describe, expect, it } from "vitest";
import { loadCorpus, searchPages } from "@banes-lab/web/domain/loaders/search.loader.ts";
import { SEARCH } from "@banes-lab/web/core/generated/search.generated.ts";
import { SEARCH_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";
import { registerPage } from "@banes-lab/web/domain/registries/page.registry.ts";

const FAKE = "fake-searchable";

registerPage({
    accent: FAKE,
    description: FAKE,
    icon: "bi-x",
    id: FAKE,
    listed: false,
    load: async () => {
        await Promise.resolve();
        return {
            content: {
                kind: "document",
                meta: { closing: "c", effectiveDate: "e", lastUpdated: "l", title: FAKE, version: "1" },
                sections: [],
            },
            description: FAKE,
            id: FAKE,
            render: () => createElement("div"),
            title: FAKE,
        };
    },
    mark: FAKE,
    order: 1,
    share: { headline: FAKE, tagline: FAKE },
    title: FAKE,
});

describe("loadCorpus", () => {
    it("gathers every registered page but the search page, with the built positions and the source definitions", async () => {
        const corpus = await loadCorpus();
        const ids = corpus.pages.map((page) => page.definition.id);
        expect(ids).toContain(FAKE);
        expect(ids).not.toContain(SEARCH_PAGE);
        expect(corpus.positions).toBe(SEARCH.positions);
        expect(corpus.definitions).toBe(SEARCH.definitions);
        expect(corpus.definitions.length).toBeGreaterThan(0);
        expect(await loadCorpus()).toBe(corpus);
    });
});

describe("searchPages", () => {
    it("loads every registered page but the search page itself", async () => {
        const ids = (await searchPages()).map((page) => page.definition.id);
        expect(ids).toContain(FAKE);
        expect(ids).not.toContain(SEARCH_PAGE);
    });
});
