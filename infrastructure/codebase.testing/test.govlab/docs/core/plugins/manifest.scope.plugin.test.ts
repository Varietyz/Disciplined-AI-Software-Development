import { describe, expect, it } from "vitest";
import { plugin } from "@govlab/docs/core/plugins/manifest.scope.plugin.ts";

describe("the scope manifest plugin", () => {
    it("filters a private module and marks a hidden one", () => {
        expect(plugin.filter?.({ visibility: { private: true } })).toBe(true);
        expect(plugin.filter?.({ visibility: { hidden: true } })).toBe(false);
        const entry = { category: null, value: "x" };
        plugin.contribute?.({ visibility: { hidden: true } }, entry);
        expect(entry).toHaveProperty("hidden", true);
    });
});
