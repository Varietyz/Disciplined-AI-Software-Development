import type { WalkAssets } from "#types/anatomy.types";

export const createWalkAssets = function createWalkAssets(): WalkAssets {
    return { cells: new Map(), sources: new Map(), walks: new Map() };
};
