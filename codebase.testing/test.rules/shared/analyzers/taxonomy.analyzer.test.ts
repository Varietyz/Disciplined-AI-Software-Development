import { describe, expect, it } from "vitest";
import { namingFinding, placementFinding, testFinding } from "@ssot/govlab/shared/analyzers/taxonomy.analyzer.ts";
import { GOVERNED_ROOT } from "@ssot/govlab/shared/resolvers/anchor.resolver.ts";
import { relativePath } from "@ssot/paths";

const REGISTRY = "base.registry.ts";

describe("placementFinding", () => {
    it("passes a conformant file and a generated file in its marker folder", () => {
        expect(placementFinding(REGISTRY, ["core", "registries"], GOVERNED_ROOT)).toBeNull();
        expect(placementFinding("ontology.generated.ts", ["core", "generated"], GOVERNED_ROOT)).toBeNull();
    });

    it("reports a generated file outside its marker folder, and a hand-written file inside one", () => {
        expect(placementFinding("ontology.generated.ts", ["core", "registries"], GOVERNED_ROOT)?.messageId).toBe(
            "markerMisplaced",
        );
        expect(placementFinding(REGISTRY, ["core", "generated"], GOVERNED_ROOT)?.messageId).toBe(
            "markerFolderIntruder",
        );
    });

    it("binds a backup copy to its backups folder", () => {
        expect(placementFinding("site-2026.backup.conf", ["core", "backups"], GOVERNED_ROOT)).toBeNull();
        expect(placementFinding("site-2026.backup.conf", ["core", "registries"], GOVERNED_ROOT)?.messageId).toBe(
            "markerMisplaced",
        );
    });

    it("leaves other name-exempt files unplaced and reports a folder that resolves to no role", () => {
        expect(placementFinding("base.registry.test.ts", ["core", "anywhere"], GOVERNED_ROOT)).toBeNull();
        expect(placementFinding(REGISTRY, ["core", "anywhere"], GOVERNED_ROOT)?.messageId).toBe("badShape");
    });
});

describe("testFinding", () => {
    const mirror = relativePath("codebase.testing.rules");

    it("reports a test outside every mirror, and passes a source file there", () => {
        expect(testFinding("base.registry.test.ts", ["core", "registries"], GOVERNED_ROOT)?.messageId).toBe(
            "misplacedTest",
        );
        expect(testFinding(REGISTRY, ["core", "registries"], GOVERNED_ROOT)).toBeNull();
    });

    it("passes a test at its subject's path in a mirror and reports one whose subject is absent", () => {
        expect(testFinding("location.resolver.test.ts", ["shared", "resolvers"], mirror)).toBeNull();
        expect(testFinding("absent.resolver.test.ts", ["shared", "resolvers"], mirror)?.messageId).toBe(
            "unmirroredTest",
        );
    });

    it("reports a file in a mirror that carries no test marker", () => {
        expect(testFinding("location.resolver.ts", ["shared", "resolvers"], mirror)?.messageId).toBe("nonTestInMirror");
    });
});

describe("namingFinding", () => {
    it("passes a file whose declared tag equals its folder's, and a name-exempt file", () => {
        expect(namingFinding(REGISTRY, ["core", "registries"], GOVERNED_ROOT)).toBeNull();
        expect(namingFinding("base.registry.test.ts", ["core", "registries"], GOVERNED_ROOT)).toBeNull();
        expect(namingFinding("README.md", ["core", "registries"], GOVERNED_ROOT)).toBeNull();
    });

    it("reports an undeclared concern word and a tag that differs from its folder's", () => {
        expect(namingFinding("base.gizmo.ts", ["core", "registries"], GOVERNED_ROOT)?.messageId).toBe("unparsable");
        expect(namingFinding("base.validator.ts", ["core", "registries"], GOVERNED_ROOT)?.messageId).toBe(
            "concernMismatch",
        );
    });

    it("admits both the unit tag and the collection tag in a folder whose concern declares a collection", () => {
        expect(namingFinding("base.asset.ts", ["core", "assets"], GOVERNED_ROOT)).toBeNull();
        expect(namingFinding("base.assets.ts", ["core", "assets"], GOVERNED_ROOT)).toBeNull();
        expect(namingFinding("base.registries.ts", ["core", "registries"], GOVERNED_ROOT)?.messageId).toBe(
            "unparsable",
        );
    });

    it("reads the concern of a file of any extension", () => {
        expect(namingFinding("base.gizmo.css", ["core", "registries"], GOVERNED_ROOT)?.messageId).toBe("unparsable");
    });
});
