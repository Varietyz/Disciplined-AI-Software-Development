import type { GraphNode } from "@banes-lab/web/types/graph.types.js";

export const graphNode = function graphNode(
    ref: string,
    kind: string,
    layer: GraphNode["layer"],
    title: string,
): GraphNode {
    return { address: null, citation: null, fields: {}, href: null, kind, layer, number: null, ref, title };
};
