import { describe, expect, it } from "vitest";
import { sitePlugin } from "@banes-lab/build-scripts/core/plugins/site.plugin.ts";

describe("sitePlugin", () => {
    it("names itself and hooks the build start, the bundle close, the config and the dev server", () => {
        const plugin = sitePlugin({ attribute: "data-walk", orderOf: () => "" });
        expect(plugin.name).toBe("site");
        expect(plugin.buildStart).toBeDefined();
        expect(plugin.closeBundle).toBeDefined();
        expect(plugin.configResolved).toBeTypeOf("function");
        expect(plugin.configureServer).toBeTypeOf("function");
    });
});
