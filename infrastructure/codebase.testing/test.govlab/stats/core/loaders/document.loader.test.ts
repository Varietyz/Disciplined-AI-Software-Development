import { BARE, IGNORE, INPUT } from "./stats.fixture.ts";
import { describe, expect, it } from "vitest";
import { collectDocArch } from "@govlab/stats/core/loaders/document.loader.ts";

describe("collectDocArch", () => {
    it("tallies every document by form and by status", () => {
        const byForm = [...INPUT.docs.byForm.values()].reduce((sum, count) => sum + count, 0);
        const byStatus = [...INPUT.docs.byStatus.values()].reduce((sum, count) => sum + count, 0);
        expect(INPUT.docs.total).toBeGreaterThan(0);
        expect(byForm).toBe(INPUT.docs.total);
        expect(byStatus).toBe(INPUT.docs.total);
    });

    it("finds nothing where no document folder exists", () => {
        expect(collectDocArch(BARE, IGNORE).total).toBe(0);
    });
});
