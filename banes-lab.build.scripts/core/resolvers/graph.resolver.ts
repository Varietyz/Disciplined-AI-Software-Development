import { CHUNK_JOINER, CHUNK_STEM, CHUNK_SUFFIX } from "#configuration/constants/graph.constants";

export const chunkFileOf = function chunkFileOf(collection: string): string {
    return CHUNK_STEM + CHUNK_JOINER + collection + CHUNK_SUFFIX;
};
