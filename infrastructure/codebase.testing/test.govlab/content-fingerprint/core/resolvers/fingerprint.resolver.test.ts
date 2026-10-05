import {
    CACHE_FOLDER,
    INDEX_EXTENSION,
} from "@govlab/content-fingerprint/configuration/constants/fingerprint.constants.ts";
import { describe, expect, it } from "vitest";
import { absolutePath } from "@ssot/paths";
import { cacheFile } from "@govlab/content-fingerprint";

describe("cacheFile", () => {
    it("resolves an index path under the workspace tool cache, whatever the working directory", () => {
        expect(cacheFile("module-docs")).toBe(absolutePath("toolCache", CACHE_FOLDER, `module-docs${INDEX_EXTENSION}`));
    });
});
