import { DISCOVERY, HOME } from "../converters/site.fixture.ts";
import { describe, expect, it } from "vitest";
import { API_SEGMENT } from "@banes-lab/build-scripts/configuration/constants/catalog.constants.ts";
import { guardPages } from "@banes-lab/build-scripts/core/guards/catalog.guard.ts";

describe("guardPages", () => {
    it("accepts page ids clear of the catalog segments and refuses one that collides", () => {
        expect(() => {
            guardPages(DISCOVERY);
        }).not.toThrow();
        const colliding = { ...DISCOVERY, pages: [{ ...HOME, id: API_SEGMENT }] };
        expect(() => {
            guardPages(colliding);
        }).toThrow(`"${API_SEGMENT}"`);
    });
});
