import { describe, expect, it, vi } from "vitest";
import { existsSync, mkdtempSync, readdirSync } from "node:fs";
import { CONFIG_FILE_SUFFIX } from "@banes-lab/build-scripts/configuration/constants/config.constants.ts";
import type { absolutePath } from "@ssot/paths";
import { extractConfigs } from "@banes-lab/build-scripts/core/coordinators/config.coordinator.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const target = vi.hoisted(() => ({ folder: "" }));

vi.mock("@ssot/paths", async (importOriginal) => {
    const original = await importOriginal<{ absolutePath: typeof absolutePath }>();
    return {
        ...original,
        absolutePath: (key: string, ...segments: string[]) =>
            key === "app.configs" ? target.folder : original.absolutePath(key, ...segments),
    };
});

describe("extractConfigs", () => {
    it("writes one neutralized config per tool into its folder and removes a file no tool writes", async () => {
        target.folder = mkdtempSync(join(tmpdir(), "banes-lab-configs-"));
        const stale = join(target.folder, "retired.config.txt");
        writeVerbatim(stale, "old");
        const count = await extractConfigs();
        const written = readdirSync(target.folder);
        expect(written).toHaveLength(count);
        expect(written.every((name) => name.endsWith(CONFIG_FILE_SUFFIX))).toBe(true);
        expect(existsSync(stale)).toBe(false);
    }, 120_000);
});
