import { slotList, surfacePath, surfacePrefix } from "../../../config/surface.config.ts";

export const RULE_ROOT = `${surfacePath("rules")}/`;

const withinSurface = function withinSurface(folder: string): string {
    const prefix = surfacePrefix();
    return prefix.length === 0 ? `${folder}/` : `${prefix}/${folder}/`;
};

export const LEAF_FOLDERS: readonly string[] = slotList("surface", "leaves").map(withinSurface);
