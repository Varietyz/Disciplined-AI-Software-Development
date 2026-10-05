import type { LayerOptions, LayerSegment } from "#types/layer.types";

const isLayerOptions = function isLayerOptions(value: unknown): value is LayerOptions {
    return typeof value === "object" && value !== null;
};

export const asLayerOptions = function asLayerOptions(value?: unknown): LayerOptions {
    return isLayerOptions(value) ? value : {};
};

const matchSegment = function matchSegment(normalized: string, segments: LayerSegment[]): string | null {
    for (const { layer, needle } of segments) {
        if (normalized.includes(needle)) {
            return layer;
        }
    }
    return null;
};

const tokensLayer = function tokensLayer(normalized: string, tokensFile: string | undefined): string {
    return typeof tokensFile === "string" && tokensFile.length > 0 && normalized.endsWith(tokensFile)
        ? "tokens"
        : "unknown";
};

export const layerOf = function layerOf(filepath: string | undefined, opts?: LayerOptions): string {
    if (typeof filepath !== "string" || filepath.length === 0) {
        return "unknown";
    }
    const normalized = filepath.split("\\").join("/");
    return matchSegment(normalized, opts?.segments ?? []) ?? tokensLayer(normalized, opts?.tokensFile);
};
