import { describe, expect, it } from "vitest";
import { DISCOVERED_FOLDER_KEYS } from "@ssot/govlab/shared/manifests/folder.manifest.ts";
import { absolutePath } from "@ssot/paths";

describe("DISCOVERED_FOLDER_KEYS", () => {
    it("names each discovery folder once, through a path key that resolves", () => {
        expect(new Set(DISCOVERED_FOLDER_KEYS).size).toBe(DISCOVERED_FOLDER_KEYS.length);
        expect(DISCOVERED_FOLDER_KEYS.map((key) => absolutePath(key).length > 0)).not.toContain(false);
    });
});
