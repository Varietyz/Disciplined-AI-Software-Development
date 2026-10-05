import { describe, expect, it } from "vitest";
import { layerOf, splitConcernLayers } from "@govlab/docs/core/parsers/layer.parser.ts";

const DOC = [
    "# @govlab/thing",
    "<!-- concern:overview -->",
    "It does a thing.",
    "<!-- /concern:overview -->",
    "<!-- concern:api -->",
    "- `doThing()`",
    "- `undoThing()`",
    "<!-- /concern:api -->",
].join("\n");

describe("splitConcernLayers", () => {
    it("returns each layer in order with its body", () => {
        const { layers, defects } = splitConcernLayers(DOC);
        expect(defects).toStrictEqual([]);
        expect(layers.map((layer) => layer.id)).toStrictEqual(["overview", "api"]);
        expect(layers[1]?.body).toBe("- `doThing()`\n- `undoThing()`");
    });

    it("reports an unclosed marker, a duplicate id and an orphan close", () => {
        expect(splitConcernLayers("<!-- concern:x -->\nbody, never closed").defects).toStrictEqual([
            { code: "unclosed-marker", id: "x" },
        ]);
        const duplicate = "<!-- concern:a -->\n1\n<!-- /concern:a -->\n<!-- concern:a -->\n2\n<!-- /concern:a -->";
        expect(splitConcernLayers(duplicate).defects).toStrictEqual([{ code: "duplicate-marker", id: "a" }]);
        expect(splitConcernLayers("text\n<!-- /concern:ghost -->").defects).toStrictEqual([
            { code: "orphan-close", id: "ghost" },
        ]);
    });

    it("handles indented markers and content outside every layer", () => {
        const { layers, defects } = splitConcernLayers(
            "before\n  <!-- concern:m -->\n  inner\n  <!-- /concern:m -->\nafter",
        );
        expect(defects).toStrictEqual([]);
        expect(layers.map((layer) => layer.body)).toStrictEqual(["  inner"]);
    });
});

describe("layerOf", () => {
    it("extracts one layer body, and null when the layer is absent", () => {
        expect(layerOf(DOC, "api")).toBe("- `doThing()`\n- `undoThing()`");
        expect(layerOf(DOC, "ai-context")).toBeNull();
    });
});
