import { asLayerOptions, layerOf } from "@govlab/quality/core/resolvers/layer.resolver.ts";
import { expect, test } from "vitest";

test("asLayerOptions passes a record through and substitutes an empty options record otherwise", () => {
    const declared = { tokensFile: "tokens.css" };
    expect(asLayerOptions(declared)).toBe(declared);
    expect(asLayerOptions()).toStrictEqual({});
    expect(asLayerOptions("tokens.css")).toStrictEqual({});
});

test("layerOf resolves the first declared segment that the normalized path contains", () => {
    const opts = {
        segments: [
            { layer: "engine", needle: "/engine/" },
            { layer: "product", needle: "/product/" },
        ],
    };
    expect(layerOf(String.raw`src\engine\panel.css`, opts)).toBe("engine");
    expect(layerOf("src/product/panel.css", opts)).toBe("product");
});

test("layerOf falls back to the tokens file, then to unknown", () => {
    const opts = { segments: [{ layer: "engine", needle: "/engine/" }], tokensFile: "tokens.css" };
    expect(layerOf("src/theme/tokens.css", opts)).toBe("tokens");
    expect(layerOf("src/theme/panel.css", opts)).toBe("unknown");
});

test("layerOf answers unknown for a missing path or an empty segment set", () => {
    expect(layerOf(undefined, { segments: [{ layer: "engine", needle: "/engine/" }] })).toBe("unknown");
    expect(layerOf("", { segments: [{ layer: "engine", needle: "/engine/" }] })).toBe("unknown");
    expect(layerOf("src/engine/panel.css", { segments: [] })).toBe("unknown");
    expect(layerOf("src/engine/panel.css")).toBe("unknown");
});
