import { describe, expect, it } from "vitest";
import type { ManifestModule } from "@govlab/docs/types/manifest.types.ts";
import { governanceMessages } from "@govlab/docs/core/validators/readme.validator.ts";

const CLEAN = {
    governConcepts: (): never[] => [],
    governDeclaredDocs: (): never[] => [],
    governManifest: (): never[] => [],
    governPrinciples: (): never[] => [],
};

const moduleWith = function moduleWith(manifest: Record<string, unknown>): ManifestModule {
    return {
        dir: "module-under-test",
        group: "test",
        label: "mod",
        manifest,
        pkg: {},
        relPath: "test/mod",
        slug: "mod",
    };
};

describe("governanceMessages", () => {
    it("emits nothing when the engine reports clean", () => {
        expect(
            governanceMessages(CLEAN, moduleWith({ docs: {} }), { generatedPrefix: "<!-- gen", onDiskReadme: "" }),
        ).toStrictEqual([]);
    });

    it("reports a generated README whose manifest lost its docs block", () => {
        const context = { generatedPrefix: "<!-- gen", onDiskReadme: "<!-- gen -->\n# Title" };
        expect(governanceMessages(CLEAN, moduleWith({}), context)).toStrictEqual([
            expect.stringContaining("docs-incomplete"),
        ]);
    });

    it("formats each engine finding with its manifest field", () => {
        const engine = { ...CLEAN, governManifest: () => [{ axis: "history-smell", detail: "d", field: "overview" }] };
        expect(
            governanceMessages(engine, moduleWith({ docs: {} }), { generatedPrefix: "<!-- gen", onDiskReadme: "" }),
        ).toStrictEqual([expect.stringContaining("[docs.overview]")]);
    });
});
