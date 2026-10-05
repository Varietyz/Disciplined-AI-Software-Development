import { APP_CONTAINERS, BARE, IGNORE, INPUT } from "../loaders/stats.fixture.ts";
import { PAGE_MARKER, STYLE_EXTENSION } from "@govlab/stats/configuration/constants/site.constants.ts";
import { describe, expect, it } from "vitest";
import { collectApp } from "@govlab/stats/core/analyzers/site.analyzer.ts";

describe("collectApp", () => {
    it("reports absence for a root with no application member", () => {
        const stats = collectApp(BARE, APP_CONTAINERS, IGNORE);
        expect(stats.present).toBe(false);
        expect(stats.sourceFiles).toBe(0);
    });

    it("counts the application member's source and pages in the real workspace", () => {
        expect(INPUT.app.present).toBe(true);
        expect(INPUT.app.sourceFiles).toBeGreaterThan(0);
        expect(INPUT.app.sourceLines).toBeGreaterThanOrEqual(INPUT.app.sourceFiles);
        expect(INPUT.app.pages.filter((page) => page.isRoot).length).toBeGreaterThan(0);
        expect(PAGE_MARKER.endsWith(".html")).toBe(true);
        expect(STYLE_EXTENSION).toBe(".css");
    });
});
