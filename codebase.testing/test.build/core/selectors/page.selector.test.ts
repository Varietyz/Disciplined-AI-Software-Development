import { describe, expect, it } from "vitest";
import { definitionOf } from "@banes-lab/build-scripts/core/selectors/page.selector.ts";

const TERMS = { content: null, description: "The terms.", id: "terms", title: "Terms" };
const LOADED = { registry: { loadedPage: (page: string) => (page === TERMS.id ? TERMS : undefined) } };

describe("definitionOf", () => {
    it("returns a registered page and refuses an id no view registers", () => {
        expect(definitionOf(LOADED, "terms")).toBe(TERMS);
        expect(() => definitionOf(LOADED, "gone")).toThrow('"gone"');
    });
});
