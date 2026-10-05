import type { CatalogDocEntry, CatalogPayload } from "#types/index.types";
import type { DocGraph, DocNode } from "#types/document.types";
import type { CatalogContext } from "#types/environment.types";
import { MODULE_BARREL_KEY } from "#configuration/constants/document.constants";
import { docNodeOf } from "#core/converters/document.converter";
import { parseFrontmatter } from "#core/parsers/metadata.parser";
import { readTextSafe } from "#core/loaders/base.loader";

const NAME_FIELD = "name";

const nodeOf = function nodeOf(context: CatalogContext, doc: string): DocNode[] {
    const relDoc = context.relative(doc);
    if (!relDoc.startsWith(context.rootPrefix)) {
        return [];
    }
    const { fields } = parseFrontmatter(readTextSafe(doc) ?? "");
    return typeof fields[NAME_FIELD] === "string" ? [docNodeOf(relDoc, fields)] : [];
};

export const catalogNodes = function catalogNodes(context: CatalogContext): DocNode[] {
    return context.docs.flatMap((doc) => nodeOf(context, doc));
};

const entryOf = function entryOf(node: DocNode, superseded: ReadonlySet<string>): CatalogDocEntry {
    return {
        concern: node.concern,
        dependsOn: node.dependsOn,
        governs: node.governs,
        links: node.links,
        name: node.name,
        path: node.relPath,
        status: node.status ?? "",
        summary: node.summary,
        superseded: superseded.has(node.name),
        supersedes: node.supersedes,
        type: node.type,
    };
};

const indexBy = function indexBy(
    entries: readonly CatalogDocEntry[],
    key: (entry: CatalogDocEntry) => string,
): Record<string, string[]> {
    const index: Record<string, string[]> = {};
    for (const entry of entries) {
        index[key(entry)] = [...(index[key(entry)] ?? []), entry.name];
    }
    return index;
};

export const catalogPayload = function catalogPayload(
    graph: DocGraph,
    superseded: ReadonlySet<string>,
): CatalogPayload {
    const docs = graph.nodes
        .map((node) => entryOf(node, superseded))
        .toSorted((left, right) => left.name.localeCompare(right.name));
    return {
        byConcern: indexBy(docs, (entry) => entry.concern),
        byStatus: indexBy(docs, (entry) => entry.status),
        byType: indexBy(docs, (entry) => entry.type),
        cycles: graph.cycles,
        deadEdges: graph.deadEdges,
        docs,
        duplicateNames: graph.duplicateNames,
        superseded: graph.superseded,
    };
};

export const concernGroups = function concernGroups(graph: DocGraph): Map<string, DocNode[]> {
    const groups = new Map<string, DocNode[]>();
    for (const node of graph.nodes) {
        const key = node.concern.length > 0 ? node.concern : MODULE_BARREL_KEY;
        groups.set(key, [...(groups.get(key) ?? []), node]);
    }
    return groups;
};
