import type { FrameContext, Layer } from "#types/card.types";
import { PAGE_POOL_OPACITY, PAGE_POOL_ORIGINS, PAGE_POOL_REACH, PAGE_POOL_SIZE } from "#configuration/data/page.data";
import { squareHeight } from "#core/evaluators/card.fragment.evaluator";

const TURN = Math.PI * 2;

const poolLayer = function poolLayer(origin: readonly [number, number], index: number): Layer {
    const phase = index / PAGE_POOL_ORIGINS.length;
    const angle = (frame: FrameContext): number => (frame.progress + phase) * TURN;
    return {
        className: "share-pool",
        id: `pool-${String(index)}`,
        kind: "box",
        opacity: PAGE_POOL_OPACITY[index] ?? 0,
        placement: {
            anchor: "center",
            height: (frame) => squareHeight(PAGE_POOL_SIZE, frame),
            width: PAGE_POOL_SIZE,
            x: (frame) => origin[0] + PAGE_POOL_REACH * Math.cos(angle(frame)),
            y: (frame) => origin[1] + PAGE_POOL_REACH * Math.sin(angle(frame)),
        },
    };
};

export const fieldLayers = function fieldLayers(field?: readonly Layer[]): readonly Layer[] {
    const ground: Layer = {
        className: "share-ground",
        id: "ground",
        kind: "box",
        placement: { height: 1, width: 1, x: 0, y: 0 },
    };
    return field ?? [ground, ...PAGE_POOL_ORIGINS.map(poolLayer)];
};
