import { describe, expect, it } from "vitest";
import { INPUT } from "../loaders/stats.fixture.ts";
import { appSection } from "@govlab/stats/core/reporters/site.reporter.ts";

describe("appSection", () => {
    it("renders a row per page, and nothing for an absent application", () => {
        expect(appSection(INPUT.app).filter((line) => line.startsWith("| `")).length).toBeGreaterThanOrEqual(
            INPUT.app.pages.length,
        );
        expect(appSection({ ...INPUT.app, present: false })).toStrictEqual([]);
    });
});
