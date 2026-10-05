import { describe, expect, it } from "vitest";
import { FILE_ROUTES } from "@banes-lab/build-scripts/configuration/constants/site.constants.ts";
import { isFileRoute } from "@banes-lab/build-scripts/core/predicates/route.predicate.ts";

describe("isFileRoute", () => {
    it("accepts an address under every served file route and refuses a page address", () => {
        expect(FILE_ROUTES.every((route) => isFileRoute(`${route}a.png`))).toBe(true);
        expect(isFileRoute("/terms")).toBe(false);
        expect(isFileRoute("/json/terms")).toBe(false);
    });
});
