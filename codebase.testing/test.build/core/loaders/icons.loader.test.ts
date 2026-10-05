import { describe, expect, it } from "vitest";
import { discoverIcons } from "@banes-lab/build-scripts/core/loaders/icons.loader.ts";

const ICON_PREFIX = "bi-";

describe("discoverIcons", () => {
    it("collects every icon name the icon modules declare, without the prefix, sorted and deduplicated", async () => {
        const names = await discoverIcons();
        expect(names.length).toBeGreaterThan(0);
        expect(names.every((name) => name.length > 0 && !name.startsWith(ICON_PREFIX))).toBe(true);
        expect(new Set(names).size).toBe(names.length);
        expect([...names].toSorted((a, b) => a.localeCompare(b))).toStrictEqual(names);
    });
});
