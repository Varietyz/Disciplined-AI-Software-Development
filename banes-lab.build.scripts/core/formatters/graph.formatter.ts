import { ASSET_SPECIFIER, CHUNK_JOINER, CHUNK_STEM, GENERATED_TAG } from "#configuration/constants/graph.constants";
import type { GraphChunk } from "@banes-lab/web/types/graph.types.js";

export const renderGraphChunk = function renderGraphChunk(chunk: GraphChunk): string {
    return [
        'import type { GraphChunk } from "#types/graph.types";',
        "",
        `export const GRAPH: GraphChunk = JSON.parse(${JSON.stringify(JSON.stringify(chunk))});`,
        "",
    ].join("\n");
};

export const renderGraphLoader = function renderGraphLoader(collections: readonly string[]): string {
    const entries = collections.map(
        (collection) =>
            `    [${JSON.stringify(collection)}, () => import(${JSON.stringify(ASSET_SPECIFIER + CHUNK_STEM + CHUNK_JOINER + collection + GENERATED_TAG)})],`,
    );
    return [
        'import type { GraphChunk } from "#types/graph.types";',
        "",
        "const LOADERS: ReadonlyMap<string, () => Promise<{ readonly GRAPH: GraphChunk }>> = new Map([",
        ...entries,
        "]);",
        "",
        "export const loadGraph = async function loadGraph(collection: string): Promise<GraphChunk | null> {",
        "    const load = LOADERS.get(collection);",
        "    return load === undefined ? null : (await load()).GRAPH;",
        "};",
        "",
    ].join("\n");
};
