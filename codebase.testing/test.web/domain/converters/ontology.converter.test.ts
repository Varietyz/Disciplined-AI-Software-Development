import {
    anchorOf,
    codeOf,
    exemplarBlocks,
    faceLink,
    fields,
    glossary,
    hrefOf,
    labeled,
    linkList,
    linkOf,
    linkRow,
    linked,
    plainList,
    row,
    slugOf,
    text,
    wideRow,
} from "@banes-lab/web/domain/converters/ontology.converter.ts";
import { describe, expect, it } from "vitest";
import { NONE_LABEL } from "@banes-lab/web/configuration/strings/ontology.strings.ts";

describe("references", () => {
    it("maps a collection reference to its tab anchor and href, and leaves an unknown collection unresolved", () => {
        expect(anchorOf("architecture:single-responsibility")).toBe("architecture-single-responsibility");
        expect(hrefOf("lexicon:yagni")).toBe("/ontology/lexicon#lexicon-yagni");
        expect(hrefOf("architecture:dry")).toBe("/ontology#architecture-dry");
        expect(anchorOf("quality:x")).toBeNull();
        expect(hrefOf("stage:orient")).toBe("/ontology/reasoning#stage-orient");
        expect(hrefOf("force:modularity")).toBe("/ontology/schema#force-modularity");
        expect(hrefOf("layer:structural-core")).toBe("/ontology/schema#layer-structural-core");
        expect(hrefOf("reasoning:node-identity")).toBe("/ontology/reasoning#reasoning-node-identity");
        expect(hrefOf("lexicon-category:core-vocabulary")).toBe("/ontology/lexicon#lexicon-category-core-vocabulary");
        expect(hrefOf("chapter:/disciplined-methodology/plan#worth-before-work")).toBe(
            "/disciplined-methodology/plan#worth-before-work",
        );
        expect(linkOf({ label: "Plain", ref: null })).toBe("Plain");
        expect(linkOf({ label: "Linked", ref: "algorithms:x" })).toBe(
            '<a href="/ontology/algorithms#algorithms-x">Linked</a>',
        );
        expect(faceLink("tension", "a-b", "the pair")).toBe('<a href="/ontology/schema#tension-a-b">the pair</a>');
        expect(faceLink("nowhere", "x", "plain")).toBe("plain");
        expect(linkList([])).toBe(NONE_LABEL);
        expect(plainList(["a", "b"])).toBe("a, b");
    });

    it("labels a value, links an edge and drops an empty relation row", () => {
        expect(labeled("Kind", "principle")).toBe("Kind: principle");
        expect(labeled("Kind", null)).toBeNull();
        expect(linked("Layer", { label: "Core", ref: "layer:core" })).toBe(
            'Layer: <a href="/ontology/schema#layer-core">Core</a>',
        );
        expect(linked("Layer", null)).toBeNull();
        expect(linkRow("Contracts", [])).toStrictEqual([]);
        expect(linkRow("Contracts", [{ label: "A", ref: null }])).toStrictEqual([
            { description: "A", term: "Contracts" },
        ]);
    });
});

describe("blocks", () => {
    it("builds rows, glossaries, text, code and exemplar panels", () => {
        expect(row("t", "d")).toStrictEqual({ description: "d", term: "t" });
        expect(wideRow("t", "d")).toStrictEqual({ description: "d", term: "t", wide: true });
        expect(glossary([row("t", "d")]).kind).toBe("glossary");
        expect(text("x")).toStrictEqual({ kind: "text", text: "x" });
        expect(codeOf("T", "c", "text").language).toBe("text");
        expect(exemplarBlocks(null, "B", "A")).toStrictEqual([]);
        const panels = exemplarBlocks({ after: "y", before: "x", lang: "ts", medium: "code" }, "B", "A");
        expect(panels.map((block) => (block.kind === "code" ? block.language : ""))).toStrictEqual([
            "typescript",
            "typescript",
        ]);
        expect(fields(["a", null, "", "b"])).toBe("a · b");
    });
});

describe("slugOf", () => {
    it("joins the safe characters of a label with hyphens", () => {
        expect(slugOf("Core / Modular  Design")).toBe("core-modular-design");
    });
});
