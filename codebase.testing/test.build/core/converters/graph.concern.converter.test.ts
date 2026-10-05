import type { AnatomyFile, AnatomyFolder, AnatomyStats } from "@banes-lab/web/types/anatomy.types.ts";
import {
    concernEdges,
    concernLayerEdges,
    concernScopeOf,
} from "@banes-lab/build-scripts/core/converters/graph.concern.converter.ts";
import { describe, expect, it } from "vitest";
import type { ConcernScope } from "@banes-lab/build-scripts/types/graph.types.ts";
import { createLexicon } from "@govlab/context";

const STATS: AnatomyStats = {
    bytes: 0,
    callable: 0,
    definitions: 0,
    edges: 0,
    exported: 0,
    files: 0,
    findings: {},
    flows: {},
    lines: { blank: 0, code: 0, total: 0 },
};

const STORE_TERM = "lexicon:store-tag";
const STORE_CATEGORY = "lexicon-category:planted-concerns";

const file = function file(path: string, concern: string | null, layer: string | null): AnatomyFile {
    return {
        definitions: [],
        distribution: { invariants: [], variants: [] },
        document: null,
        findings: [],
        generated: false,
        id: path,
        inherited: false,
        layer,
        name: path,
        path,
        slots: concern === null ? null : { concern, subject: "cart", variant: null },
        source: null,
        stats: STATS,
        walk: null,
    };
};

const ROOT: AnatomyFolder = {
    files: [
        file("cart.store.ts", "store", "domain"),
        file("loose.ts", null, null),
        file("cart.view.ts", "view", "product"),
    ],
    findings: [],
    folders: [],
    id: "",
    layer: null,
    name: "",
    path: "",
    role: "member",
    stats: STATS,
    walk: null,
};

const TERMS = createLexicon({
    data: [
        {
            category: "planted-concerns",
            records: [
                {
                    definition: "A formal definition of the tag for a planted file, filed in a stores folder.",
                    kind: "artifact",
                    name: "Store Tag",
                },
            ],
        },
    ],
}).all();

const scopeOf = function scopeOf(records: readonly string[]): ConcernScope {
    return concernScopeOf({
        built: { context: { lex: { all: () => TERMS } } },
        ids: { fileId: (path) => path },
        ontology: { nodes: records.map((ref) => ({ ref })) },
        trees: [{ snapshot: { tree: ROOT } }],
    });
};

describe("concernEdges and concernLayerEdges", () => {
    it("draw an edge from each file to its concern tag's term and to that term's category", () => {
        const scope = scopeOf([STORE_TERM, STORE_CATEGORY]);
        expect(concernEdges(scope, "concern")).toStrictEqual([
            { from: "anatomy:cart.store.ts", relation: "concern", to: STORE_TERM },
        ]);
        expect(concernLayerEdges(scope, "concern-layer")).toStrictEqual([
            { from: "anatomy:cart.store.ts", relation: "concern-layer", to: STORE_CATEGORY },
        ]);
    });

    it("draw no edge to a record the ontology does not hold", () => {
        expect(concernEdges(scopeOf([]), "concern")).toStrictEqual([]);
        expect(concernLayerEdges(scopeOf([]), "concern-layer")).toStrictEqual([]);
    });
});
