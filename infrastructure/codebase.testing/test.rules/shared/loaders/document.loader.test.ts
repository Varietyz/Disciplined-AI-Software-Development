import { describe, expect, it } from "vitest";
import { governedDocumentTexts, governedManifests } from "@ssot/govlab/shared/loaders/document.loader.ts";
import { relativePath } from "@ssot/paths";

describe("governedManifests and governedDocumentTexts", () => {
    it("list every member manifest and read the behavior document and the manifests line by line", () => {
        const manifests = governedManifests();
        expect(manifests.length).toBeGreaterThan(0);
        expect(manifests.every((file) => file.endsWith("_manifest.json"))).toBe(true);
        const texts = governedDocumentTexts();
        expect(texts.some((text) => text.at.startsWith(`${relativePath("claudePolicy")}:`))).toBe(true);
    });
});
