import {
    DUPLICATE_CONCERN_TAG,
    markerFolderShadowsConcern,
    unboundMarkerFolder,
} from "@ssot/govlab/shared/strings/taxonomy.strings.ts";
import { assertMirrors, assertTaxonomy } from "@ssot/govlab/shared/validators/taxonomy.validator.ts";
import { describe, expect, it } from "vitest";
import type { TaxonomyView } from "@ssot/govlab/types/taxonomy.types.ts";

const CONCERN = { folder: "registries", layer: "infrastructure", tag: "registry" };

const viewWith = function viewWith(overrides: Partial<TaxonomyView>): TaxonomyView {
    return {
        byFolder: new Map([[CONCERN.folder, CONCERN]]),
        byTag: new Map([[CONCERN.tag, CONCERN]]),
        compoundMarkers: ["test"],
        containers: new Map([["root", new Set(["core"])]]),
        declaredContainers: { root: ["core"] },
        declaredSpecial: {},
        dialects: [],
        fixtureMarkers: [],
        generatedFolder: null,
        ignoredNames: ["index.ts"],
        markerFolders: new Map([["test", "tests"]]),
        maxDepth: 3,
        special: new Map([["root", new Set<string>()]]),
        splitters: [
            { joiner: null, letters: "upper", name: "pascal" },
            { joiner: "_", letters: "lower", name: "snake" },
        ],
        subjects: new Set(["base"]),
        testMarkers: ["test"],
        ...overrides,
    };
};

describe("assertTaxonomy", () => {
    it("accepts a consistent declaration", () => {
        expect(() => {
            assertTaxonomy(viewWith({}), 1);
        }).not.toThrow();
    });

    it("accepts a concern whose collection tag is its own, and refuses one whose collection tag is another concern's tag", () => {
        const assets = { collection: "assets", folder: "assets", layer: "infrastructure", tag: "asset" };
        const withCollection = viewWith({
            byFolder: new Map([
                [CONCERN.folder, CONCERN],
                [assets.folder, assets],
            ]),
            byTag: new Map([
                [CONCERN.tag, CONCERN],
                [assets.tag, assets],
                [assets.collection, assets],
            ]),
        });
        expect(() => {
            assertTaxonomy(withCollection, 2);
        }).not.toThrow();
        const clashing = { ...assets, collection: "registry" };
        const clash = viewWith({
            byFolder: new Map([
                [CONCERN.folder, CONCERN],
                [clashing.folder, clashing],
            ]),
            byTag: new Map([
                [CONCERN.tag, clashing],
                [clashing.tag, clashing],
            ]),
        });
        expect(() => {
            assertTaxonomy(clash, 2);
        }).toThrow(DUPLICATE_CONCERN_TAG);
    });

    it("refuses a subject that is already a concern tag", () => {
        expect(() => {
            assertTaxonomy(viewWith({ subjects: new Set(["registry"]) }), 1);
        }).toThrow("already a concern tag");
    });

    it("refuses a root that declares no containers", () => {
        const emptyRoot = new Map([["root", new Set<string>()]]);
        const view = viewWith({ containers: emptyRoot, declaredContainers: { root: [] } });
        expect(() => {
            assertTaxonomy(view, 1);
        }).toThrow("declares no containers");
    });

    it("accepts a dialect that binds its extensions to a declared splitter", () => {
        expect(() => {
            assertTaxonomy(viewWith({ dialects: [{ extensions: ["java", "kt"], splitter: "pascal" }] }), 1);
        }).not.toThrow();
    });

    it("refuses a duplicate splitter name and a joiner that holds a letter", () => {
        const twiceNamed = [
            { joiner: "_", letters: "lower" as const, name: "snake" },
            { joiner: "_", letters: "upper" as const, name: "snake" },
        ];
        expect(() => {
            assertTaxonomy(viewWith({ splitters: twiceNamed }), 1);
        }).toThrow("declares 'snake' twice");
        expect(() => {
            assertTaxonomy(viewWith({ splitters: [{ joiner: "x", letters: "lower", name: "ex" }] }), 1);
        }).toThrow("holds a letter or digit");
    });

    it("refuses a dialect naming an undeclared splitter, one binding no extension, and an extension bound twice", () => {
        expect(() => {
            assertTaxonomy(viewWith({ dialects: [{ extensions: ["c"], splitter: "screaming" }] }), 1);
        }).toThrow("which grammar.splitters does not declare");
        expect(() => {
            assertTaxonomy(viewWith({ dialects: [{ extensions: [], splitter: "pascal" }] }), 1);
        }).toThrow("binds no extension");
        const twice = [
            { extensions: ["kt"], splitter: "pascal" },
            { extensions: ["kt"], splitter: "snake" },
        ];
        expect(() => {
            assertTaxonomy(viewWith({ dialects: twice }), 1);
        }).toThrow("bound by two dialects");
    });

    it("refuses a marker folder bound to no marker, and one that reuses a concern folder", () => {
        expect(() => {
            assertTaxonomy(viewWith({ markerFolders: new Map([["generated", "generated"]]) }), 1);
        }).toThrow(unboundMarkerFolder("generated"));
        expect(() => {
            assertTaxonomy(viewWith({ markerFolders: new Map([["test", "registries"]]) }), 1);
        }).toThrow(markerFolderShadowsConcern("test", "registries"));
    });

    it("refuses an ignore pattern made only of wildcards and a depth cap below the minimum", () => {
        expect(() => {
            assertTaxonomy(viewWith({ ignoredNames: ["*"] }), 1);
        }).toThrow("only wildcards");
        expect(() => {
            assertTaxonomy(viewWith({ maxDepth: 1 }), 1);
        }).toThrow("maxDepthFromRoot");
    });
});

describe("assertMirrors", () => {
    const roots = new Set(["src"]);

    it("accepts a mirror of a declared root and refuses a mirror that is a root or mirrors none", () => {
        expect(() => {
            assertMirrors({ "test.src": "src" }, roots);
        }).not.toThrow();
        expect(() => {
            assertMirrors({ src: "src" }, roots);
        }).toThrow("both a test mirror and a declared root");
        expect(() => {
            assertMirrors({ "test.lib": "lib" }, roots);
        }).toThrow("which is not a declared root");
    });
});
