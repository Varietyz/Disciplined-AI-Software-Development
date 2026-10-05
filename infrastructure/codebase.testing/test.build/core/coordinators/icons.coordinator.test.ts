import { FONT_FILE, SUBSET_FILE } from "@banes-lab/build-scripts/configuration/constants/icons.constants.ts";
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { absolutePath } from "@ssot/paths";
import { buildIcons } from "@banes-lab/build-scripts/core/coordinators/icons.coordinator.ts";
import { discoverIcons } from "@banes-lab/build-scripts/core/loaders/icons.loader.ts";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const SWAP = "font-display: swap;";
const WOFF2_SIGNATURE = "wOF2";

describe("buildIcons", () => {
    it("writes the stylesheet at its path key and the subset font in its generated folder, reporting the glyph count", async () => {
        const count = await buildIcons();
        const names = await discoverIcons();
        const font = join(absolutePath("app.iconFont"), SUBSET_FILE);
        expect(count).toBe(names.length);
        expect(existsSync(font)).toBe(true);
        const written = readFileSync(font);
        const full = readFileSync(fileURLToPath(import.meta.resolve(`bootstrap-icons/font/fonts/${FONT_FILE}`)));
        expect(written.subarray(0, WOFF2_SIGNATURE.length).toString("latin1")).toBe(WOFF2_SIGNATURE);
        expect(written.length).toBeLessThan(full.length);
        const css = readFileSync(absolutePath("app.icons"), "utf8");
        expect(css).toContain(SWAP);
        expect(css.split("::before {")).toHaveLength(count + 2);
    });
});
