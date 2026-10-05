import { describe, expect, it } from "vitest";
import { ScenarioPlayer } from "@banes-lab/build-scripts/core/adapters/surface.adapter.ts";
import { join } from "node:path";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";

describe("ScenarioPlayer", () => {
    it("stops the recording with a surfaces finding when the install holds no package to drive", async () => {
        const install = mkdtempSync(join(tmpdir(), "banes-lab-scenario-"));
        await expect(new ScenarioPlayer(install, new Map()).play()).rejects.toThrow("surfaces: ");
    }, 60_000);
});
