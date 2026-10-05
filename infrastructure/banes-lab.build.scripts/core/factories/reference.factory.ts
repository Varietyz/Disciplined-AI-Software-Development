import type { EdgeRef } from "@banes-lab/web/types/link.types.js";
import type { ReferenceRelation } from "@banes-lab/web/types/reference.types.js";

export const relationOf = function relationOf(id: string, edges: readonly EdgeRef[]): readonly ReferenceRelation[] {
    return edges.length === 0 ? [] : [{ edges, relation: id }];
};

export const singleRelation = function singleRelation(id: string, edge: EdgeRef | null): readonly ReferenceRelation[] {
    return edge === null ? [] : [{ edges: [edge], relation: id }];
};
