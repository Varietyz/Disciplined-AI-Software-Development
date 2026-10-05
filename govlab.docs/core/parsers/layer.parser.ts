import {
    LAYER_CLOSE_PREFIX as CLOSE_PREFIX,
    LAYER_MARKER_END as MARKER_END,
    LAYER_OPEN_PREFIX as OPEN_PREFIX,
} from "#configuration/constants/layer.constants";
import type { ConcernLayer, LayerDefect, LayerSplit } from "#types/markdown.types";

const markerId = function markerId(trimmed: string, prefix: string): string | null {
    if (!trimmed.startsWith(prefix) || !trimmed.endsWith(MARKER_END)) {
        return null;
    }
    const inner = trimmed.slice(prefix.length, trimmed.length - MARKER_END.length).trim();
    return inner.length > 0 ? inner : null;
};

class LayerParser {
    public readonly layers: ConcernLayer[] = [];
    public readonly defects: LayerDefect[] = [];
    private readonly seen = new Set<string>();
    private openId: string | null = null;
    private bodyLines: string[] = [];

    public feed(raw: string): void {
        const trimmed = raw.trim();
        const opened = markerId(trimmed, OPEN_PREFIX);
        if (opened !== null) {
            this.open(opened);
            return;
        }
        const closed = markerId(trimmed, CLOSE_PREFIX);
        if (closed !== null) {
            this.close(closed);
            return;
        }
        if (this.openId !== null) {
            this.bodyLines.push(raw);
        }
    }

    public finish(): void {
        if (this.openId !== null) {
            this.defects.push({ code: "unclosed-marker", id: this.openId });
        }
    }

    private open(id: string): void {
        if (this.openId !== null) {
            this.defects.push({ code: "unclosed-marker", id: this.openId });
        }
        if (this.seen.has(id)) {
            this.defects.push({ code: "duplicate-marker", id });
        }
        this.seen.add(id);
        this.openId = id;
        this.bodyLines = [];
    }

    private close(id: string): void {
        if (this.openId !== id) {
            this.defects.push({ code: "orphan-close", id });
            return;
        }
        this.layers.push({ body: this.bodyLines.join("\n"), id });
        this.openId = null;
        this.bodyLines = [];
    }
}

export const splitConcernLayers = function splitConcernLayers(doc: string): LayerSplit {
    const parser = new LayerParser();
    for (const raw of doc.split("\n")) {
        parser.feed(raw);
    }
    parser.finish();
    return { defects: parser.defects, layers: parser.layers };
};

export const layerOf = function layerOf(doc: string, id: string): string | null {
    return splitConcernLayers(doc).layers.find((layer) => layer.id === id)?.body ?? null;
};
