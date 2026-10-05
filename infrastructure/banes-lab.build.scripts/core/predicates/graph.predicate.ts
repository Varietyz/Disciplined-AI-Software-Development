import { CHUNK_JOINER, CHUNK_STEM, CHUNK_SUFFIX } from "#configuration/constants/graph.constants";

export const isChunkFile = function isChunkFile(name: string): boolean {
    const collection = name.startsWith(CHUNK_STEM + CHUNK_JOINER) && name.endsWith(CHUNK_SUFFIX);
    return collection && name.length > (CHUNK_STEM + CHUNK_JOINER + CHUNK_SUFFIX).length;
};
