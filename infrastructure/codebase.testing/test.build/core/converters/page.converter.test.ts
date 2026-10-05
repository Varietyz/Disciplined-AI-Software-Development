import { DISCOVERY, SOURCE } from "./site.fixture.ts";
import { describe, expect, it } from "vitest";
import { routesOf } from "@banes-lab/build-scripts/core/converters/page.converter.ts";

describe("routesOf", () => {
    it("lists every page at its own path, then every tab route no page already serves", () => {
        expect(routesOf(SOURCE, DISCOVERY)).toStrictEqual([
            { page: "home", path: "/" },
            { page: "terms", path: "/terms" },
            { page: "terms", path: "/terms/guide" },
        ]);
    });
});
