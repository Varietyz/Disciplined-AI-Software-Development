import { describe, expect, it } from "vitest";
import { syncedLine } from "@banes-lab/build-scripts/configuration/strings/folder.strings.ts";

describe("syncedLine", () => {
    it("names the step and the copied and removed counts", () => {
        expect(syncedLine("governance", { copied: 2, removed: 1 })).toBe(
            "governance: copied 2 changed file(s), removed 1\n",
        );
    });
});
