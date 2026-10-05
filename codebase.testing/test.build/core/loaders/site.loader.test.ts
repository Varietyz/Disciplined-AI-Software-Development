import { describe, expect, it } from "vitest";
import { loadFrom } from "@banes-lab/build-scripts/core/loaders/site.loader.ts";

describe("loadFrom", () => {
    it("is the step that loads the web member's pages through a module server", () => {
        expect(typeof loadFrom).toBe("function");
    });
});
