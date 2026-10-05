import { describe, expect, it, vi } from "vitest";
import { mkdirSync, mkdtempSync } from "node:fs";
import type { ViewportOptions } from "@project/scripts/types/viewport.types.ts";
import { auditRoutes } from "@project/scripts/core/coordinators/viewport.coordinator.ts";
import { join } from "node:path";
import { launchBrowser } from "@banes-lab/build-scripts/core/factories/browser.factory.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

vi.mock("@banes-lab/build-scripts/core/factories/browser.factory.ts", async (importOriginal) => ({
    ...(await importOriginal<Record<string, unknown>>()),
    launchBrowser: vi.fn(() => ({ close: vi.fn<() => Promise<void>>().mockResolvedValue(), exitCode: () => null })),
}));

const builtSite = function builtSite(): string {
    const root = mkdtempSync(join(tmpdir(), "viewport-site-"));
    mkdirSync(root, { recursive: true });
    writeVerbatim(join(root, "index.html"), "home");
    return root;
};

const options: ViewportOptions = {
    browser: null,
    height: 1,
    outDir: mkdtempSync(join(tmpdir(), "viewport-run-")),
    routes: [],
    settleMs: 0,
    software: true,
    timeoutMs: 0,
    width: 1,
};

describe("auditRoutes", () => {
    it("stops the browser and reports failure when devtools never answers", async () => {
        await expect(auditRoutes("browser", options, builtSite(), ["/"])).resolves.toBe(false);
        expect(launchBrowser).toHaveBeenCalled();
    });
});
