import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { SITE_PAGES } from "@banes-lab/build-scripts/configuration/constants/learning.constants.ts";
import { buildTabs } from "@banes-lab/build-scripts/core/persistence/tab.persistence.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("buildTabs", () => {
    it("writes the tabs of every site page and counts them", async () => {
        const dir = mkdtempSync(join(tmpdir(), "tabs-"));
        try {
            const file = join(dir, "tabs.generated.ts");
            const router = {
                pagePath: (page: string) => `/${page}`,
                tabLink: (page: string, tab: string) => `/${page}/${tab}`,
            };
            const count = await buildTabs(router, () => [{ id: "intro", label: "Intro" }], file);
            expect(count).toBe(SITE_PAGES.length);
            expect(readFileSync(file, "utf8")).toContain("export const PAGE_TABS");
        } finally {
            rmSync(dir, { force: true, recursive: true });
        }
    });
});
