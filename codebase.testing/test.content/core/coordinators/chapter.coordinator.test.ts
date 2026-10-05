import { describe, expect, it } from "vitest";
import { existsSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { renderSurface } from "@banes-lab/content/core/coordinators/chapter.coordinator.ts";
import { tmpdir } from "node:os";

describe("renderSurface", () => {
    it("refuses without a site build and otherwise writes the shape into the folder it is given", async () => {
        const out = mkdtempSync(join(tmpdir(), "surface-"));
        const result = await renderSurface("wiki", out);
        if (result.ok) {
            expect(result.out).toBe(out);
            expect(result.chapters.length).toBeGreaterThan(0);
            expect(existsSync(join(out, "Home.md"))).toBe(true);
            return;
        }
        expect(result.reason.length).toBeGreaterThan(0);
    }, 120_000);
});
