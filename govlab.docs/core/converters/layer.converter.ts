import { LAYER_CLOSE_PREFIX, LAYER_MARKER_END, LAYER_OPEN_PREFIX } from "#configuration/constants/layer.constants";

const openMarker = function openMarker(id: string): string {
    return `${LAYER_OPEN_PREFIX}${id} ${LAYER_MARKER_END}`;
};

const closeMarker = function closeMarker(id: string): string {
    return `${LAYER_CLOSE_PREFIX}${id} ${LAYER_MARKER_END}`;
};

export const wrapLayer = function wrapLayer(id: string, body: string): string {
    return `${openMarker(id)}\n${body}\n${closeMarker(id)}`;
};

const joinAround = function joinAround(before: string, after: string): string {
    if (before === "") {
        return after;
    }
    return after === "" ? `${before}\n` : `${before}\n\n${after}`;
};

export const stripConcern = function stripConcern(text: string, id: string): string {
    const open = openMarker(id);
    const close = closeMarker(id);
    const start = text.indexOf(open);
    const closeAt = start === -1 ? -1 : text.indexOf(close, start);
    if (closeAt === -1) {
        return text;
    }
    return joinAround(text.slice(0, start).trimEnd(), text.slice(closeAt + close.length).trimStart());
};
